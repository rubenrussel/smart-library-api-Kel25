import { pool } from '../config/db.js';

export const LoanModel = {
    createLoan: async (book_id, member_id, due_date) => {
        const result = await pool.query(
            'INSERT INTO loans (book_id, member_id, due_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [book_id, member_id, due_date, 'BORROWED']
        );
        return result.rows[0];
    },

    getTopBorrowers: async () => {
        const query = `
            SELECT 
                m.id AS member_id,
                m.full_name, 
                m.email, 
                m.member_type,
                COUNT(l.id)::INTEGER AS total_loans,
                MAX(l.loan_date) AS last_loan_date,
                (
                    SELECT json_build_object(
                        'title', b.title,
                        'times_borrowed', COUNT(l2.id)::INTEGER
                    )
                    FROM loans l2
                    JOIN books b ON l2.book_id = b.id
                    WHERE l2.member_id = m.id
                    GROUP BY b.id, b.title
                    ORDER BY COUNT(l2.id) DESC
                    LIMIT 1
                ) AS favorite_book
            FROM members m
            JOIN loans l ON m.id = l.member_id
            GROUP BY m.id
            ORDER BY total_loans DESC
            LIMIT 3;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    getAllLoans: async () => {
        const result = await pool.query('SELECT * FROM loans');
        return result.rows;
    }
};
