import pool from '../db/dev/pool';

var GoalModel = {
    create: async (newGoal) => {
        if (newGoal.title && newGoal.description && newGoal.complete) {
            try {
                const result = await pool.query('INSERT INTO goals (title, description, complete) VALUES ($1, $2, $3) RETURNING *', [newGoal.title, newGoal.description, newGoal.complete]);
                return result.rows[0];
            } catch (error) {
                throw new Error(error);
            }
        }
        throw new Error('Goal validation failed: `title, `complete` and `description` are required.');
    },
    findAll: async () => {
        try {
            // pool.query('SELECT title, description, complete FROM goals');
            const result = await pool.query('SELECT * FROM goals');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching records');
        }
    },
    findById: async (id) => {
        try {
            const result = await pool.query('SELECT * FROM goals WHERE id=$1', [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching record');
        }
    },
    findByIdAndDelete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM goals WHERE id=$1 returning *', [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error('No record found to delete');
        }
    },
    findByIdAndUpdate: async (id, body) => {
        try {
            const result = await pool.query('UPDATE goals SET complete=$1 WHERE id=$2 returning *', [body.complete, id]);
            return result.rows[0];
        } catch (error) {
            throw new Error('No record found to update');
        }
    },
    findByIdAndReplace: async (id, newGoal) => {
        try {
            const result = await pool.query('UPDATE goals SET title=$1, description=$2, complete=$3 WHERE id=$4 returning *', [newGoal.title, newGoal.description, newGoal.complete, id]);
            return result.rows[0];
        } catch (error) {
            throw new Error('No record found to update');
        }
    }
}

export default GoalModel;
