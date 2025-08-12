import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./BlogContent.module.scss";
import postsService from "../../services/postsService";

const BlogContent = (props) => {
  const {
    title,
    content,
    user,
    published_at,
    create_at,
    updated_at,
    readTime,
    topics = [],
    tags = [],
    thumbnail,
    loading = false,
    className,
    usersBookmarked = [],
    is_like = false,
    is_bookmark = false,
  } = props;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <article className={`${styles.blogContent} ${className || ""}`}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonHeader}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonMeta} />
          </div>
          <div className={styles.skeletonContent}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={styles.skeletonParagraph} />
            ))}
          </div>
        </div>
      </article>
    );
  }
   

  return (
    <article className={`${styles.blogContent} ${className || ""}`}>
      {/* Featured Image */}
      {thumbnail && (
        <div className={styles.imageContainer}>
          <FallbackImage
            src={thumbnail}
            alt={title}
            className={styles.thumbnail}
          />
        </div>
      )}

      {/* Article Header */}
      <header className={styles.header}>
        {/* Topic Badge */}
        {topics &&
          topics.map((topic) => (
            <div key={topic.id} className={styles.topicBadge}>
              <Badge variant="primary" size="md">{topic.name}</Badge>
            </div>
          ))}

        {/* Title */}
        <h1 className={styles.title}>{title}</h1>

        {/* Meta Information */}
        <div className={styles.meta}>
          <div className={styles.author}>
            {user?.avatar && (
              <FallbackImage
                src={user.avatar}
                alt={user.name}
                className={styles.authorAvatar}
              />
            )}
            <div className={styles.authorInfo}>
              <Link
                to={`/profile/${
                  user?.username ||
                  user?.first_name?.toLowerCase().replace(/\s+/g, "-")
                }`}
                className={styles.authorName}
              >
                {user?.name}
                {user?.first_name}
              </Link>
              <div className={styles.dateInfo}>
                <time dateTime={published_at} className={styles.publishDate}>
                  {formatDate(published_at)}
                </time>
                {updated_at && updated_at !== published_at && (
                  <span className={styles.updateInfo}>
                    • Updated {formatDate(updated_at)}
                  </span>
                )}
                {readTime && (
                  <span className={styles.readTime}>• {readTime} min read</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className={styles.content}>
        {typeof content === "string" ? (
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          content
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <footer className={styles.footer}>
          <div className={styles.tags}>
            <span className={styles.tagsLabel}>Tags:</span>
            <div className={styles.tagsList}>
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </footer>
      )}
    </article>
  );
};

// ✅ Khai báo prop types
BlogContent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  user: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  published_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
  readTime: PropTypes.number,
  topics: PropTypes.array,
  tags: PropTypes.arrayOf(PropTypes.string),
  thumbnail: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
  usersBookmarked: PropTypes.array,
  is_like: PropTypes.bool,
  is_bookmark: PropTypes.bool,
};

export default BlogContent;
