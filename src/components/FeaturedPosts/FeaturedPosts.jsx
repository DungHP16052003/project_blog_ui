import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./FeaturedPosts.module.scss";
import postsService from "../../services/postsService";

const FeaturedPosts = ({
  posts = [],
  setPosts, // ✅ Prop để cập nhật posts state
  loading = false,
  title = "Featured Posts",
  showTitle = true,
  maxPosts = 6,
  className,
  ...props
}) => {
  if (loading) {
    return (
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <Loading size="md" text="Loading featured posts..." />
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <EmptyState
          title="No featured posts"
          description="There are no featured posts available at the moment."
          icon="⭐"
        />
      </section>
    );
  }

  // ✅ FIXED: Handle like with state update (same as PostList)
  const handleLike = async (postId) => {
    try {
      const result = await postsService.toggleLikePost(postId);
      console.log(result)
      // ✅ Update posts state after successful API call
      if (setPosts) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  is_like: !post.is_like,
                  likes_count: post.is_like 
                    ? Math.max(0, (post.likes_count || 0) - 1)
                    : (post.likes_count || 0) + 1
                }
              : post
          )
        );
      }
      
      return result;
    } catch (error) {
      throw new Error(error?.message || 'Failed to like post');
    }
  };

  // ✅ FIXED: Handle bookmark with state update (same as PostList)
  const handleBookmark = async (postId) => {
    try {
      const result = await postsService.toggleBookmarkPost(postId);
      
      // ✅ Update posts state after successful API call
      if (setPosts) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, is_bookmark: !post.is_bookmark }
              : post
          )
        );
      }
      
      return result;
    } catch (error) {
      throw new Error(error?.message || 'Failed to bookmark post');
    }
  };

  // Sort posts by likes (descending) for featured display
  const sortedPosts = [...posts].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
  const displayPosts = sortedPosts.slice(0, maxPosts);

  return (
    <section
      className={`${styles.featuredPosts} ${className || ""}`}
      {...props}
    >
      {showTitle && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.postsGrid}>
        {displayPosts.map((post, index) => (
          <div
            key={post.id || post.slug}
            className={`${styles.postItem} ${
              index === 0 ? styles.featured : ""
            }`}
          >
            <PostCard
              id={post.id}
              likes={post.likes_count || 0}
              views={post.views_count || 0}
              title={post.title}
              meta_description={post.meta_description}
              user={post.user}
              published_at={post.published_at}
              readTime={post.readTime || 2} // ✅ Use post.readTime if available
              topic={
                // ✅ FIXED: Better topic handling for different data structures
                post.topics 
                  ? Array.isArray(post.topics)
                    ? post.topics // Already an array
                    : post.topics.name 
                      ? [{ name: post.topics.name }] // Single topic object
                      : []
                  : []
              }
              author={{id : 84,  avatar: null, username: 'nguyenvancongcbg27'}}
              slug={post.slug}
              thumbnail={post.thumbnail}
              isLiked={post?.is_like || false}
              onLike={handleLike} // ✅ Simplified - only pass postId
              onBookmark={handleBookmark} // ✅ Simplified - only pass postId
              isBookmarked={post?.is_bookmark || false}
              compact={index > 0} // ✅ Make non-featured posts compact
              className={index === 0 ? styles.featuredCard : styles.regularCard}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

FeaturedPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      meta_description: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string, // ✅ Added for consistency
        avatar: PropTypes.string,
        username: PropTypes.string,
      }).isRequired,
      published_at: PropTypes.string.isRequired,
      readTime: PropTypes.number,
      topics: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string.isRequired,
          })
        ),
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string.isRequired,
        }),
        PropTypes.string, // ✅ Added for flexibility
      ]),
      slug: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      views_count: PropTypes.number,
      likes_count: PropTypes.number,
      is_like: PropTypes.bool,
      is_bookmark: PropTypes.bool,
    })
  ).isRequired,
  setPosts: PropTypes.func, // ✅ Optional but recommended
  loading: PropTypes.bool,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  maxPosts: PropTypes.number,
  className: PropTypes.string,
};

export default FeaturedPosts;