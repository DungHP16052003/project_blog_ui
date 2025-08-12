import { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./PostCard.module.scss";
import { toast } from "react-toastify";

const PostCard = ({
  id,
  title,
  meta_description,
  user,
  published_at,
  updated_at,
  readTime,
  topic = [],
  tags = [],
  slug,
  thumbnail,
  loading = false,
  compact = false,
  className,
  // New interaction props
  likes = 10,
  views = 100,
  isLiked = false,
  isBookmarked = false,
  showViewCount = true,
  showInteractions = true,
  onLike,
  onBookmark,
  ...props
}) => {
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(isBookmarked);
  const [optimisticLikes, setOptimisticLikes] = useState(likes);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);

  // ✅ FIXED: Sync with props when they change (after parent state update)
  useEffect(() => {
    setOptimisticLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setOptimisticBookmarked(isBookmarked);
  }, [isBookmarked]);

  useEffect(() => {
    setOptimisticLikes(likes);
  }, [likes]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ FIXED: Simplified handleLike - parent handles state updates
  const handleLike = async () => {
    if (!onLike || likingInProgress) return;

    const previousLiked = optimisticLiked;
    const previousLikes = optimisticLikes;

    try {
      setLikingInProgress(true);
      
      // Optimistic update
      setOptimisticLiked(!optimisticLiked);
      setOptimisticLikes(optimisticLiked ? optimisticLikes - 1 : optimisticLikes + 1);

      const result = await onLike(id); // ✅ Only pass postId

      // Show success message
      toast.success(!previousLiked ? "You liked this post ❤️" : "You unliked this post 💔");
      
    } catch (error) {
      // Revert optimistic updates on error
      setOptimisticLiked(previousLiked);
      setOptimisticLikes(previousLikes);
      
      toast.error(error?.message || "Failed to like post");
      console.error("Failed to toggle like:", error);
    } finally {
      setLikingInProgress(false);
    }
  };

  // ✅ FIXED: Simplified handleBookmark - parent handles state updates
  const handleBookmark = async () => {
    if (!onBookmark || bookmarkingInProgress) return;
    
    const previousBookmarked = optimisticBookmarked;
    
    try {
      setBookmarkingInProgress(true);
      
      // Optimistic update
      setOptimisticBookmarked(!optimisticBookmarked);
      
      const result = await onBookmark(id); // ✅ Only pass postId
      
      // Show success message
      toast.success(!previousBookmarked ? "Post bookmarked!" : "Bookmark removed!");
      
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticBookmarked(previousBookmarked);
      
      toast.error(error.message || "Failed to bookmark post");
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setBookmarkingInProgress(false);
    }
  };

  if (loading) {
    return (
      <Card
        className={`${styles.postCard} ${styles.loading} ${className || ""}`}
        variant="default"
        padding="none"
        {...props}
      >
        <div className={styles.skeletonImage} />
        <div className={styles.content}>
          <div className={styles.skeletonBadge} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonExcerpt} />
          <div className={styles.skeletonMeta} />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`${styles.postCard} ${compact ? styles.compact : ""} ${
        className || ""
      }`}
      variant="default"
      hoverable
      padding="none"
      {...props}
    >
      {/* Featured Image */}
      <div className={styles.imageContainer}>
        <Link to={`/blog/${slug}`}>
          <FallbackImage
            src={thumbnail}
            alt={title || "Blog post"}
            className={styles.image}
            lazy={true}
          />
        </Link>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Topic Badge - Fixed array check and key */}
        {Array.isArray(topic) &&
          topic.length > 0 &&
          topic.map((topic, index) => {
            return (
              <div key={topic.id || index} className={styles.topicBadge}>
                <Badge variant="primary" size="sm">
                  {topic.name}
                </Badge>
              </div>
            );
          })}

        {/* Title */}
        <h3 className={styles.title}>
          <Link to={`/blog/${slug}`} className={styles.titleLink}>
            {title}
          </Link>
        </h3>

        {/* Excerpt - Fixed: use meta_description instead of undefined excerpt */}
        {meta_description && (
          <p className={styles.excerpt}>{meta_description}</p>
        )}

        {/* Meta Information */}
        <div className={styles.meta}>
          <div className={styles.author}>
            {user?.avatar && (
              <FallbackImage
                src={user.avatar}
                alt={user.name || user.first_name || "User avatar"}
                className={styles.authorAvatar}
              />
            )}
            <Link
              to={`/profile/${
                user?.username ||
                 `${user?.first_name} ${user?.last_name}` ||
                "unknown"
              }`}
              className={styles.authorName}
            >
              {user?.name || user?.first_name || "Unknown Author"}
            </Link>
          </div>

          <div className={styles.metaInfo}>
            {published_at && (
              <span className={styles.date}>{formatDate(published_at)}</span>
            )}
            {readTime && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.readTime}>{readTime} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Interactions */}
        {showInteractions && (
          <div className={styles.interactions}>
            <div className={styles.stats}>
              {/* View Count */}
              {showViewCount && views > 0 && (
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {views}
                </span>
              )}

              {/* Like Count */}
              {optimisticLikes > 0 && (
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {optimisticLikes}
                </span>
              )}
            </div>

            <div className={styles.actions}>
              {/* Like Button */}
              <button
                className={`${styles.actionButton} ${
                  optimisticLiked ? styles.liked : ""
                } ${likingInProgress ? styles.loading : ""}`}
                onClick={handleLike}
                disabled={likingInProgress}
                title={optimisticLiked ? "Unlike" : "Like"}
                aria-label={`${optimisticLiked ? "Unlike" : "Like"} this post`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={optimisticLiked ? "currentColor" : "none"}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Bookmark Button */}
              <button
                className={`${styles.actionButton} ${
                  optimisticBookmarked ? styles.bookmarked : ""
                } ${bookmarkingInProgress ? styles.loading : ""}`}
                onClick={handleBookmark}
                disabled={bookmarkingInProgress}
                title={optimisticBookmarked ? "Remove bookmark" : "Bookmark"}
                aria-label={`${
                  optimisticBookmarked ? "Remove bookmark from" : "Bookmark"
                } this post`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill={optimisticBookmarked ? "currentColor" : "none"}
                >
                  <path
                    d="M3 1C2.45 1 2 1.45 2 2V15L8 12L14 15V2C14 1.45 13.55 1 13 1H3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Fixed PropTypes to match actual props
PostCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ✅ Added id prop
  title: PropTypes.string.isRequired,
  meta_description: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string, // ✅ Added last_name
    avatar: PropTypes.string,
    username: PropTypes.string,
  }),
  published_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
  readTime: PropTypes.number,
  topic: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
    })
  ),
  tags: PropTypes.arrayOf(PropTypes.string),
  slug: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  loading: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string,
  // New interaction props
  likes: PropTypes.number,
  views: PropTypes.number,
  isLiked: PropTypes.bool,
  isBookmarked: PropTypes.bool,
  showViewCount: PropTypes.bool,
  showInteractions: PropTypes.bool,
  onLike: PropTypes.func,
  onBookmark: PropTypes.func,
};

export default memo(PostCard);

