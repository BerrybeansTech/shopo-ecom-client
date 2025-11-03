// src/components/Helpers/Cards/BlogCard.jsx
import { Link } from "react-router-dom";

export default function BlogCard({ className = "", datas }) {
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`blog-card-wrapper w-full border border-[#D3D3D3] ${className}`}
    >
      <div className="img w-full h-[340px] overflow-hidden">
        <Link to={`/blogs/${datas.slug}`}>
          <img
            src={datas.thumbnail_image}
            alt={datas.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>

      <div className="p-[24px]">
        <div className="flex items-center mb-3 text-base text-qgraytwo">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1.5"
          >
            <path
              d="M11.6667 1.75H2.33333C1.875 1.75 1.5 2.125 1.5 2.58333V11.9167C1.5 12.375 1.875 12.75 2.33333 12.75H11.6667C12.125 12.75 12.5 12.375 12.5 11.9167V2.58333C12.5 2.125 12.125 1.75 11.6667 1.75Z"
              stroke="#FFBB38"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.91667 0.875V2.625"
              stroke="#FFBB38"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.08333 0.875V2.625"
              stroke="#FFBB38"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.5 5.25H12.5"
              stroke="#FFBB38"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{formatDate(datas.date)}</span>
        </div>

        <Link to={`/blogs/${datas.slug}`}>
          <h1 className="text-[22px] text-qblack hover:text-blue-500 font-semibold line-clamp-2 mb-1 capitalize transition-colors">
            {datas.title}
          </h1>
        </Link>

        <p className="text-qgraytwo text-[15px] leading-[30px] line-clamp-2 mb-3">
          {datas.description}
        </p>

        <Link to={`/blogs/${datas.slug}`}>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <span className="text-qblack text-base font-semibold group-hover:text-blue-500 transition-colors">
              View More
            </span>
            <svg
              width="17"
              height="14"
              viewBox="0 0 17 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-qblack group-hover:text-blue-500 transition-colors"
            >
              <path
                d="M14.0225 6.00243C13.9998 6.03738 13.9772 6.06941 13.9545 6.10436C13.8724 6.10727 13.7904 6.11601 13.7083 6.11601C9.93521 6.11601 6.16215 6.11601 2.38909 6.11601C1.87111 6.11601 1.35313 6.10728 0.835147 6.12475C0.351131 6.14514 0.00863998 6.51501 0.000148475 6.981C-0.00834303 7.45864 0.3483 7.83725 0.837977 7.8722C0.956858 7.88094 1.07857 7.87511 1.20028 7.87511C5.33565 7.87803 9.46818 7.87803 13.6035 7.88094C13.7253 7.88094 13.8498 7.88094 13.9715 7.88094C14.0026 7.93627 14.031 7.9887 14.0621 8.04403C13.9404 8.12267 13.7988 8.18383 13.697 8.28576C12.3355 9.67499 10.9797 11.0671 9.62669 12.4651C9.26155 12.8437 9.25306 13.3767 9.58423 13.732C9.91823 14.0902 10.4419 14.099 10.8127 13.7233C12.7855 11.702 14.7556 9.6779 16.7199 7.64794C17.0907 7.26351 17.0851 6.73053 16.7171 6.34901C14.7697 4.33652 12.8167 2.32987 10.858 0.329035C10.7278 0.195063 10.5466 0.0873038 10.3683 0.0319679C10.0088 -0.0757916 9.63235 0.116428 9.44554 0.451356C9.26438 0.78046 9.31533 1.20859 9.60687 1.51148C10.6768 2.62111 11.7524 3.72492 12.8308 4.82581C13.2271 5.2219 13.6262 5.60925 14.0225 6.00243Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}