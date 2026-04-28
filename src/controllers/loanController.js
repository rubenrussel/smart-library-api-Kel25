import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
    createLoan: async (req, res) => {
        const { book_id, member_id, due_date } = req.body;
        try {
            const loan = await LoanModel.createLoan(book_id, member_id, due_date);
            res.status(201).json({
                message: "Peminjaman berhasil dicatat!",
                data: loan
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTopBorrowers: async (req, res) => {
        try {
            const borrowers = await LoanModel.getTopBorrowers();
            res.status(200).json(borrowers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getLoans: async (req, res) => {
        try {
            const loans = await LoanModel.getAllLoans();
            res.status(200).json(loans);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
