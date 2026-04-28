import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
    getTopBorrowers: async (req, res) => {
        try {
            const borrowers = await LoanModel.getTopBorrowers();
            res.status(200).json({
                message: "Top 3 peminjam buku berhasil diambil",
                data: borrowers
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

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

    getLoans: async (req, res) => {
        try {
            const loans = await LoanModel.getAllLoans();
            res.status(200).json({
                message: "Seluruh data peminjaman berhasil diambil",
                data: loans
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
