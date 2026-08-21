import { Route } from "react-router-dom";
import BlogPage from "@/pages/BlogPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";

export const renderCompanyBlogRoutes = () => (
  <>
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/contact" element={<ContactPage />} />
  </>
);
