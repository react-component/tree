module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setupFilesAfterEnv.js'],
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
};
