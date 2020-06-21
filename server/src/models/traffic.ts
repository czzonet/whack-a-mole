module.exports = (sequelize: any, DataTypes: any) => {
  const traffic = sequelize.define(
    "traffic",
    {
      date: DataTypes.DATE,
      rx: DataTypes.DOUBLE,
      tx: DataTypes.DOUBLE,
    },
    {}
  );
  traffic.associate = function(models: any) {
    // associations can be defined here
    // traffic.hasMany(models["Itemo"]);
    // traffic.belongsTo(models["Itemj"]);
    // traffic.hasMany(models.itemc_traffix);
  };
  return traffic;
};
