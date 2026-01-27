// Database seeding utilities
const User = require('../models/User');
const Complaint = require('../models/Complaint');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});

    // Create sample users
    const sampleUsers = [
      {
        name: 'Jean Bosco Mukasa',
        email: 'jean.mukasa@govconnect.rw',
        phone: '+250788123456',
        password: 'password123',
        role: 'citizen',
        location: 'Kayonza'
      },
      {
        name: 'Aline Uwimana',
        email: 'aline.uwimana@govconnect.rw',
        phone: '+250788234567',
        password: 'password123',
        role: 'citizen',
        location: 'Kigali'
      },
      {
        name: 'Admin User',
        email: 'admin@govconnect.rw',
        phone: '+250788345678',
        password: 'admin123',
        role: 'admin',
        location: 'Kigali'
      }
    ];

    await User.insertMany(sampleUsers);
    console.log('✓ Sample users created');

    // Create sample complaints
    const users = await User.find({ role: 'citizen' });
    const sampleComplaints = [
      {
        userId: users[0]._id,
        category: 'agriculture',
        title: 'Irrigation System Not Working',
        description: 'The community irrigation system has been broken for 3 weeks with no repairs',
        location: {
          district: 'Kayonza',
          sector: 'Mugesera',
          cell: 'Kayonza Cell'
        },
        priority: 'high',
        isUrgent: true
      },
      {
        userId: users[1]._id,
        category: 'other',
        title: 'Market License Processing Delays',
        description: 'License approval taking longer than expected, affecting business operations',
        location: {
          district: 'Kigali',
          sector: 'Gasabo',
          cell: 'Ndera'
        },
        priority: 'medium'
      }
    ];

    await Complaint.insertMany(sampleComplaints);
    console.log('✓ Sample complaints created');
  } catch (error) {
    console.error('Database seeding error:', error);
  }
};

module.exports = { seedDatabase };
