// src/components/Blogs/index.jsx
import { useEffect, useState } from "react";
import { blogApi } from "../Blogs/Blog.jsx/blogApi"; 
import BlogCard from "../Helpers/Cards/BlogCard";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function Blogs() {
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getAllBlogs();

        if (response.success) {
          setBlogsData(response.data);
        } else {
          setError("Failed to load blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ----------------- LOADING UI -----------------
  if (loading) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <PageTitle
          title="Our Blogs"
          breadcrumb={[
            { name: "home", path: "/" },
            { name: "blogs", path: "/blogs" },
          ]}
        />

        <div className="w-full py-[60px]">
          <div className="container-x mx-auto flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-qyellow border-t-transparent"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // ----------------- ERROR UI -----------------
  if (error) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <PageTitle
          title="Our Blogs"
          breadcrumb={[
            { name: "home", path: "/" },
            { name: "blogs", path: "/blogs" },
          ]}
        />

        <div className="w-full py-[60px]">
          <div className="container-x mx-auto text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ----------------- MAIN UI -----------------
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <PageTitle
        title="Our Blogs"
        breadcrumb={[
          { name: "home", path: "/" },
          { name: "blogs", path: "/blogs" },
        ]}
      />

      <div className="w-full py-[60px]">
        <div className="container-x mx-auto">
          {blogsData.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No blogs available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-5">
              {blogsData.map((blogItem) => (
                <div data-aos="fade-up" key={blogItem.id} className="item w-full">
                  <BlogCard datas={blogItem} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
