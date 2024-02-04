module.exports = {
  apps : [{
    script: './app/main.ts',
    watch: './app'
  }, {
    script: './queue/_worker.ts',
    watch: ['./queue']
  }]
};
