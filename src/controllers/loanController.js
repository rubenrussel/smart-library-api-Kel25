import { pool } from '../config/db.js';

export const LoanController = {
    getTopBorrowers: async (req, res) => {
        try {
            const query = `
                SELECT 
                    m.full_name, 
                    m.email, 
                    m.member_type,
                    COUNT(l.id)::INTEGER AS total_pinjaman,
                    (
                        SELECT b.title 
                        FROM loans l2 
                        JOIN books b ON l2.book_id = b.id 
                        WHERE l2.member_id = m.id 
                        GROUP BY b.title 
                        ORDER BY COUNT(l2.id) DESC 
                        LIMIT 1
                    ) AS buku_favorit,
                    MAX(l.loan_date) AS pinjaman_terakhir
                FROM members m
                JOIN loans l ON m.id = l.member_id
                GROUP BY m.id
                ORDER BY total_pinjaman DESC
                LIMIT 3;
            `;
            
            const result = await pool.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getLoans: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM loans');
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createLoan: async (req, res) => {
        try {
            const { member_id, book_id, loan_date, return_date } = req.body;
            const result = await pool.query(
                'INSERT INTO loans (member_id, book_id, loan_date, return_date) VALUES ($1, $2, $3, $4) RETURNING *',
                [member_id, book_id, loan_date, return_date]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
