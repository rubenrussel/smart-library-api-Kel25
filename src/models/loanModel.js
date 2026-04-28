import { pool } from '../config/db.js';

export const LoanModel = {
    // 1. Buat nyatat pinjaman (Harus ada status 'BORROWED')
    createLoan: async (book_id, member_id, due_date) => {
        const result = await pool.query(
            'INSERT INTO loans (book_id, member_id, due_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [book_id, member_id, due_date, 'BORROWED']
        );
        return result.rows[0];
    },

    // 2. Fungsi yang bikin error tadi (Harus ada ini)
    getTopBorrowers: async () => {
        const query = `
            SELECT 
                m.full_name, 
                m.email, 
                m.member_type,
                COUNT(l.id)::INTEGER AS total_pinjaman,
                (SELECT b.title FROM loans l2 JOIN books b ON l2.book_id = b.id WHERE l2.member_id = m.id GROUP BY b.title ORDER BY COUNT(l2.id) DESC LIMIT 1) AS buku_favorit,
                MAX(l.loan_date) AS pinjaman_terakhir
            FROM members m
            JOIN loans l ON m.id = l.member_id
            GROUP BY m.id
            ORDER BY total_pinjaman DESC
            LIMIT 3;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    // 3. Buat dipanggil sama getLoans di Controller
    getAllLoans: async () => {
        const result = await pool.query('SELECT * FROM loans');
        return result.rows;
    }
};
