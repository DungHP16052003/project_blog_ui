import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import Pagination from "../Pagination/Pagination";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./PostList.module.scss";
import postsService from "../../services/postsService";

const PostList = ({
  posts = [],
  setPosts,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  maxPosts,
  onPageChange,
  showPagination = true,
  layout = "grid",
  className,
  ...props
}) => {
  // Trạng thái đang tải
  if (loading) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <Loading size="md" text="Loading posts..." />
      </div>
    );
  }

  // Nếu không có posts hoặc posts không phải array
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <EmptyState
          title="No posts found"
          description="There are no posts available for this topic."
          icon="📝"
        />
      </div>
    );
  }

  // ✅ FIXED: Handle like with state update
  const handleLike = async (postId) => {
    try {
      const result = await postsService.toggleLikePost(postId);
      
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

  // ✅ FIXED: Handle bookmark with state update
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

  // Xử lý danh sách bài viết hiển thị
  const displayPosts = [...posts].slice(0, maxPosts ?? posts.length).reverse();

  return (
    <div className={`${styles.postList} ${className || ""}`} {...props}>
      <div className={`${styles.postsContainer} ${styles[layout]}`}>
        {displayPosts.map((post) => (
          <div key={post.id || post.slug} className={styles.postItem}>
            <PostCard
              id={post.id}
              title={post.title}
              likes={post.likes_count}
              views={post.views_count}
              meta_description={post.meta_description}
              user={post.user}
              published_at={post.published_at}
              readTime={post.readTime}
              topic={post.topics ? (Array.isArray(post.topics) ? post.topics : [{ name: post.topics[0]?.name }]) : []}
              slug={post.slug}
              thumbnail={post.thumbnail}
              isLiked={post?.is_like || false}
              onLike={handleLike} // ✅ Simplified - only pass postId
              onBookmark={handleBookmark} // ✅ Simplified - only pass postId
              isBookmarked={post?.is_bookmark || false}
            />
          </div>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      meta_description: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        first_name: PropTypes.string,
        avatar: PropTypes.string,
        username: PropTypes.string,
      }),
      published_at: PropTypes.string.isRequired,
      readTime: PropTypes.number,
      topics: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string.isRequired,
          })
        ),
        PropTypes.string,
      ]),
      slug: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      likes_count: PropTypes.number,
      views_count: PropTypes.number,
      is_like: PropTypes.bool,
      is_bookmark: PropTypes.bool,
    })
  ),
  setPosts: PropTypes.func.isRequired, // ✅ Made required for state updates
  loading: PropTypes.bool,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  maxPosts: PropTypes.number,
  onPageChange: PropTypes.func,
  showPagination: PropTypes.bool,
  layout: PropTypes.oneOf(["grid", "list"]),
  className: PropTypes.string,
};

export default PostList;