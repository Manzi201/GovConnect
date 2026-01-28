const { Message, User } = require('../models');
const { Op } = require('sequelize');

// Get messages between current user and another user
exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'profilePhoto'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'profilePhoto'] }
            ]
        });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, complaintId } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver and content are required' });
        }

        const message = await Message.create({
            senderId,
            receiverId,
            content,
            complaintId
        });

        // Fetch message with associations for response
        const fullMessage = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'profilePhoto'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'profilePhoto'] }
            ]
        });

        res.status(201).json({ message: fullMessage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const currentUserId = req.user.id;

        await Message.update(
            { isRead: true, readAt: new Date() },
            {
                where: {
                    senderId,
                    receiverId: currentUserId,
                    isRead: false
                }
            }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
