// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('games', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER,
//       },
//       game_state: {
//         type: Sequelize.JSON,
//       },
//       created_at: {
//         allowNull: false,
//         type: Sequelize.DATE,
//       },
//       updated_at: {
//         allowNull: false,
//         type: Sequelize.DATE,
//       },
//     });
//   },

//   down: async (queryInterface) => {
//     await queryInterface.dropTable('games');
//   },
// };

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      game_state: {
        type: Sequelize.JSON,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    //   await queryInterface.createTable('game_users', {
    //     id: {
    //       allowNull: false,
    //       autoIncrement: true,
    //       primaryKey: true,
    //       type: Sequelize.INTEGER,
    //     },
    //     game_id: {
    //       allowNull: false,
    //       type: Sequelize.INTEGER,
    //       references: {
    //         model: 'games',
    //         key: 'id',
    //       },
    //     },
    //     user_id: {
    //       allowNull: false,
    //       type: Sequelize.INTEGER,
    //       references: {
    //         model: 'users',
    //         key: 'id',
    //       },
    //     },
    //     created_at: {
    //       allowNull: false,
    //       type: Sequelize.DATE,
    //     },
    //     updated_at: {
    //       allowNull: false,
    //       type: Sequelize.DATE,
    //     },

  //   });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users', null, {});
    await queryInterface.dropTable('games', null, {});
    // await queryInterface.dropTable('game_users', null, {});
  },
};
