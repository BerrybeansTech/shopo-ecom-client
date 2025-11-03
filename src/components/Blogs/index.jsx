// src/components/Blogs/index.jsx
import blog from "../../data/blogs.json";
import BlogCard from "../Helpers/Cards/BlogCard";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { Link } from "react-router-dom";

export default function Blogs() {
  const blogsData = blog.blogs;

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="blogs-wrapper w-full">
        <div className="title-bar">
          <PageTitle
            title="Our Blogs"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "blogs", path: "/blogs" },
            ]}
          />
        </div>
      </div>

      <div className="w-full py-[60px]">
        <div className="container-x mx-auto">
          <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-5">
            {blogsData.map((blogItem) => (
              <div data-aos="fade-up" key={blogItem.id} className="item w-full">
                <Link to={`/blogs/${blogItem.slug}`}>
                  <BlogCard datas={blogItem} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}