export default {
  server: {
    proxy: {
      "/api": "http://localhost:9000/",
      "/geojson": "http://localhost:9000/",
    },
  },
};
