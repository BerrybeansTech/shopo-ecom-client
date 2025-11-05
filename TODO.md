# TODO: Add Blog Content Display Feature

## Overview
Make the Blog detail page dynamic by fetching and displaying blog content from blogs.json based on the blog ID from the URL. Update BlogCard to link to the parameterized route.

## Steps
- [ ] Update BlogCard component to link to `/blogs/blog/${datas.id}` instead of static `/blogs/blog`
- [ ] Modify Blog component to:
  - Import useParams from react-router-dom
  - Use useParams to get the blog ID from the URL
  - Fetch the corresponding blog data from blogs.json
  - Display dynamic title, content (as HTML), banner image, and other details
  - Handle cases where blog is not found
- [ ] Test the navigation from Blogs list to individual Blog page
- [ ] Ensure HTML content is rendered properly using dangerouslySetInnerHTML
