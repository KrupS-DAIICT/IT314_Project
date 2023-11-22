const adminLockUpdate = async (email, db) => {
    try {
        await db.updateOne({ email: email }, { $set: { lock: 0 } });
    } catch (error) {
        console.log(error);
    }
}

const deleteAccount = async (email) => {
    try {
        await Faculty.deleteOne({ email: email });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { adminLockUpdate, deleteAccount }; // export router