export default {
  server: {
    proxy: {
      "/api": "http://localhost:9000/",
    },
  },
};
