const adminLockUpdate = async (email, db, role) => {
    try {
        await db.updateOne({ email: email }, { $set: { lock: 0 } });
    } catch (error) {
        console.log(error);
    }
}

module.exports = adminLockUpdate; // export router