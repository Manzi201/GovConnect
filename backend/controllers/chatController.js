const { Message, User, Complaint } = require('../models');
const { Op } = require('sequelize');

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, complaintId } = req.body;
        const senderId = req.user.id;

        // Optional: Check if receiver exists and is an official/admin or linked to the complaint
        const message = await Message.create({
            senderId,
            receiverId,
            content,
            complaintId
        });

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get conversation history
exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name'] },
                { model: User, as: 'receiver', attributes: ['id', 'name'] }
            ]
        });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark as read
exports.markAsRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const userId = req.user.id;

        await Message.update(
            { isRead: true, readAt: new Date() },
            { where: { senderId, receiverId: userId, isRead: false } }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
