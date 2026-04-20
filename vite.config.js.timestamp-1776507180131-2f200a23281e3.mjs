// vite.config.js
import { defineConfig } from "file:///D:/BerrybeansTech/Rabbit%20Finch/shopo-ecom-client/node_modules/vite/dist/node/index.js";
import react from "file:///D:/BerrybeansTech/Rabbit%20Finch/shopo-ecom-client/node_modules/@vitejs/plugin-react-swc/index.js";
import tailwind from "file:///D:/BerrybeansTech/Rabbit%20Finch/shopo-ecom-client/node_modules/tailwindcss/lib/index.js";
import { VitePWA } from "file:///D:/BerrybeansTech/Rabbit%20Finch/shopo-ecom-client/node_modules/vite-plugin-pwa/dist/index.js";
var pwaConfig = {
  registerType: "autoUpdate",
  includeAssets: ["logo-color.svg"],
  workbox: {
    globPatterns: ["**/*.{js,css,html,png,jpg,gif,svg}"],
    // Include your asset types
    maximumFileSizeToCacheInBytes: 3e7,
    // Increase limit to 30MB for large images (pro.jpg, pro1.jpg)
    navigateFallback: "/",
    // The fallback for client-side routing
    navigateFallbackAllowlist: [/^(?!\/__).*/],
    // Allowlist for navigateFallback
    runtimeCaching: [
      {
        urlPattern: /\.(png|jpg|gif|svg)$/,
        // Define the regex pattern for your assets
        handler: "StaleWhileRevalidate"
        // Caching strategy
      }
    ]
  },
  manifest: {
    name: "Shopo",
    short_name: "Shopo",
    description: "Shopo",
    start_url: "/",
    display: "standalone",
    background_color: "#FFBB38",
    theme_color: "#FFBB38",
    icons: [
      {
        src: "/192.png",
        sizes: "192x192",
        purpose: "any maskable"
      },
      {
        src: "/512.png",
        sizes: "512x512",
        purpose: "maskable any"
      }
    ]
  }
};
var vite_config_default = defineConfig({
  basename: "/",
  plugins: [react(), VitePWA(pwaConfig), tailwind()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxCZXJyeWJlYW5zVGVjaFxcXFxSYWJiaXQgRmluY2hcXFxcc2hvcG8tZWNvbS1jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEJlcnJ5YmVhbnNUZWNoXFxcXFJhYmJpdCBGaW5jaFxcXFxzaG9wby1lY29tLWNsaWVudFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQmVycnliZWFuc1RlY2gvUmFiYml0JTIwRmluY2gvc2hvcG8tZWNvbS1jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgdGFpbHdpbmQgZnJvbSBcInRhaWx3aW5kY3NzXCI7XHJcblxyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5cclxuLy8gQWRkIFBXQSBjb25maWd1cmF0aW9uXHJcbmNvbnN0IHB3YUNvbmZpZyA9IHtcclxuICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gIGluY2x1ZGVBc3NldHM6IFtcImxvZ28tY29sb3Iuc3ZnXCJdLFxyXG4gIHdvcmtib3g6IHtcclxuICAgIGdsb2JQYXR0ZXJuczogW1wiKiovKi57anMsY3NzLGh0bWwscG5nLGpwZyxnaWYsc3ZnfVwiXSwgLy8gSW5jbHVkZSB5b3VyIGFzc2V0IHR5cGVzXHJcbiAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMzAwMDAwMDAsIC8vIEluY3JlYXNlIGxpbWl0IHRvIDMwTUIgZm9yIGxhcmdlIGltYWdlcyAocHJvLmpwZywgcHJvMS5qcGcpXHJcbiAgICBuYXZpZ2F0ZUZhbGxiYWNrOiBcIi9cIiwgLy8gVGhlIGZhbGxiYWNrIGZvciBjbGllbnQtc2lkZSByb3V0aW5nXHJcbiAgICBuYXZpZ2F0ZUZhbGxiYWNrQWxsb3dsaXN0OiBbL14oPyFcXC9fXykuKi9dLCAvLyBBbGxvd2xpc3QgZm9yIG5hdmlnYXRlRmFsbGJhY2tcclxuICAgIHJ1bnRpbWVDYWNoaW5nOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB1cmxQYXR0ZXJuOiAvXFwuKHBuZ3xqcGd8Z2lmfHN2ZykkLywgLy8gRGVmaW5lIHRoZSByZWdleCBwYXR0ZXJuIGZvciB5b3VyIGFzc2V0c1xyXG4gICAgICAgIGhhbmRsZXI6IFwiU3RhbGVXaGlsZVJldmFsaWRhdGVcIiwgLy8gQ2FjaGluZyBzdHJhdGVneVxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICB9LFxyXG4gIG1hbmlmZXN0OiB7XHJcbiAgICBuYW1lOiBcIlNob3BvXCIsXHJcbiAgICBzaG9ydF9uYW1lOiBcIlNob3BvXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJTaG9wb1wiLFxyXG4gICAgc3RhcnRfdXJsOiBcIi9cIixcclxuICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgYmFja2dyb3VuZF9jb2xvcjogXCIjRkZCQjM4XCIsXHJcbiAgICB0aGVtZV9jb2xvcjogXCIjRkZCQjM4XCIsXHJcbiAgICBpY29uczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBcIi8xOTIucG5nXCIsXHJcbiAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgICAgIHB1cnBvc2U6IFwiYW55IG1hc2thYmxlXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IFwiLzUxMi5wbmdcIixcclxuICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgcHVycG9zZTogXCJtYXNrYWJsZSBhbnlcIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxufTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZW5hbWU6IFwiL1wiLFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBWaXRlUFdBKHB3YUNvbmZpZyksIHRhaWx3aW5kKCldLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VSxTQUFTLG9CQUFvQjtBQUN6VyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxjQUFjO0FBRXJCLFNBQVMsZUFBZTtBQUd4QixJQUFNLFlBQVk7QUFBQSxFQUNoQixjQUFjO0FBQUEsRUFDZCxlQUFlLENBQUMsZ0JBQWdCO0FBQUEsRUFDaEMsU0FBUztBQUFBLElBQ1AsY0FBYyxDQUFDLG9DQUFvQztBQUFBO0FBQUEsSUFDbkQsK0JBQStCO0FBQUE7QUFBQSxJQUMvQixrQkFBa0I7QUFBQTtBQUFBLElBQ2xCLDJCQUEyQixDQUFDLGFBQWE7QUFBQTtBQUFBLElBQ3pDLGdCQUFnQjtBQUFBLE1BQ2Q7QUFBQSxRQUNFLFlBQVk7QUFBQTtBQUFBLFFBQ1osU0FBUztBQUFBO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxVQUFVO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxTQUFTO0FBQUEsSUFDVCxrQkFBa0I7QUFBQSxJQUNsQixhQUFhO0FBQUEsSUFDYixPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBO0FBQUEsUUFDRSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixVQUFVO0FBQUEsRUFDVixTQUFTLENBQUMsTUFBTSxHQUFHLFFBQVEsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNuRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
