import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthorInfo from "../../components/AuthorInfo/AuthorInfo";
import PostList from "../../components/PostList/PostList";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

import styles from "./Profile.module.scss";
import postsService from "../../services/postsService";
import profileService from "../../services/profileService";
import useUser from "../../hook/useUser";
import {
  checkFollow,
  follow,
  unfollow,
} from "../../services/followService";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState({});
  const [followLoading, setFollowLoading] = useState(false);

  const { currentUser } = useUser();
  

  // ✅ Load profile từ API (sửa chỗ xử lý { success, data })
  useEffect(() => {
    (async () => {
      const response = await profileService.getProfileByUserName(username);

      // Giữ nguyên format { success, data }
      if (!response?.success || !response?.data) return;

      // Nếu profile bị ẩn
      if (response.data.canView === false) {
        setUser({ ...response.data });
        return;
      }

      const userData = { ...response.data };

      // Parse skills nếu lưu dạng string
      userData.skills =
        typeof userData.skills === "string"
          ? JSON.parse(userData.skills) || []
          : userData.skills;

      setUser({
        ...userData,
        social: {
          twitter: userData.twitter_url,
          github: userData.github_url,
          linkedin: userData.linkedin_url,
          website: userData.website_url,
        },
      });
    })();
  }, [username]);

  // ✅ Đồng bộ user → profile
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setProfile(user);
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  // ✅ Kiểm tra follow
  useEffect(() => {
    const loadFollowStatus = async () => {
      if (!profile?.id || !currentUser?.id || profile.id === currentUser.id)
        return;

      try {
        const result = await checkFollow(profile.id);
        setIsFollowing(result.isFollowing || false);
      } catch (error) {
        console.error("Failed to check follow status:", error);
        setIsFollowing(false);
      }
    };

    if (profile && currentUser) {
      loadFollowStatus();
    }
  }, [profile?.id, currentUser?.id]);

  // ✅ Check profile owner
  const isOwnProfile = profile?.username === currentUser?.username;

  // Follow / Unfollow
  const handleFollowClick = async () => {
    if (!profile?.id || !currentUser?.id || followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        const result = await unfollow(profile.id);
        if (result.success) {
          setIsFollowing(false);
          setProfile((prev) => ({
            ...prev,
            followers_count: Math.max(0, (prev.followers_count || 0) - 1),
          }));
        }
      } else {
        const result = await follow(profile.id);
        if (result.success) {
          setIsFollowing(true);
          setProfile((prev) => ({
            ...prev,
            followers_count: (prev.followers_count || 0) + 1,
          }));
        }
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  };

  // Load posts
 useEffect(() => {
        if (profile?.canView === false) return;

        const loadPosts = async () => {
            setPostsLoading(true);
            // Simulate API delay

            const posts = await postsService.getByUsername(username);

            // const newPosts = generatePosts(currentPage);
            setPosts(posts.data);
            setTotalPages(Math.ceil(posts.data.length / 6)); // 42 total posts, 6 per page
            setPostsLoading(false);
 
            
        };

        if (profile) {
            loadPosts();
        }
    }, [profile, username, activeTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

  const handleMessageClick = () => {
    setIsChatOpen(true);
    setIsChatMinimized(false);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setIsChatMinimized(false);
  };

  const handleChatMinimize = (minimize) => {
    setIsChatMinimized(minimize);
  };

  if (loading) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <Loading size="md" text="Loading profile..." />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <EmptyState
            title="Profile not found"
            description="The user profile you're looking for doesn't exist or has been removed."
            icon="👤"
          />
        </div>
      </div>
    );
  }

  if (
    !isOwnProfile &&
    profile.settings?.profile_visibility === "followers" &&
    !isFollowing
  ) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <EmptyState
            title="Followers Only"
            description="Follow this user to see their posts and information."
            icon="👥"
          />
          <div className={styles.actions}>
            <Button
              variant="primary"
              size="md"
              onClick={handleFollowClick}
              disabled={followLoading}
            >
              {followLoading ? "Loading..." : "Follow"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      {/* Cover Section */}
      <div className={styles.coverSection}>
        <div className={styles.coverImage}>
          <FallbackImage src={profile?.coverImage} alt="Cover" />
          <div className={styles.coverOverlay}></div>
        </div>

        <div className={styles.profileHeader}>
          <div className="container">
            <div className={styles.headerContent}>
              <div className={styles.avatarSection}>
                <FallbackImage
                  src={profile?.avatar}
                  alt={profile?.name}
                  className={styles.avatar}
                />
                <div className={styles.basicInfo}>
                  <h1 className={styles.name}>
                    {profile?.first_name} {profile?.last_name}
                  </h1>
                  {/* ✅ Hiển thị username đúng */}
                  <p className={styles.username}>@{profile?.username}</p>
                  {profile?.title && (
                    <p className={styles.title}>{profile?.title}</p>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                {isOwnProfile ? (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate(`/profile/${profile?.username}/edit`)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? "secondary" : "primary"}
                      size="md"
                      onClick={handleFollowClick}
                      disabled={followLoading}
                    >
                      {followLoading
                        ? "Loading..."
                        : isFollowing
                        ? "Unfollow"
                        : "Follow"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={handleMessageClick}
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container">
        <div className={styles.content}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {profile?.about && (
              <div className={styles.bioCard}>
                <h3>About</h3>
                <p>{profile?.about}</p>
              </div>
            )}

            <div className={styles.statsCard}>
              <h3>Stats</h3>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <strong>{profile?.posts_count ?? 0}</strong>
                  <span>Posts</span>
                </div>
                <div className={styles.stat}>
                  <strong>
                    {(profile?.followers_count ?? 0).toLocaleString()}
                  </strong>
                  <span>Followers</span>
                </div>
                <div className={styles.stat}>
                  <strong>{profile?.following_count ?? 0}</strong>
                  <span>Following</span>
                </div>
                <div className={styles.stat}>
                  <strong>{(profile?.likes ?? 0).toLocaleString()}</strong>
                  <span>Likes</span>
                </div>
              </div>
            </div>

            {profile.skills?.length > 0 && (
              <div className={styles.skillsCard}>
                <h3>Skills</h3>
                <div className={styles.skills}>
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.badges?.length > 0 && (
              <div className={styles.badgesCard}>
                <h3>Achievements</h3>
                <div className={styles.badges}>
                  {profile.badges.map((badge, index) => (
                    <div key={index} className={styles.badge}>
                      <span className={styles.badgeIcon}>{badge.icon}</span>
                      <span className={styles.badgeName}>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.infoCard}>
              <h3>Info</h3>
              <div className={styles.infoItems}>
                {profile.location && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🌐</span>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📅</span>
                  <span>
                    Joined{" "}
                    {formatDate(profile.created_at || profile.joinedDate)}
                  </span>
                </div>
              </div>
            </div>

            {profile.social && (
              <div className={styles.socialCard}>
                <h3>Connect</h3>
                <div className={styles.socialLinks}>
                  {profile.social.twitter && (
                    <a
                      href={profile.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>🐦</span> Twitter
                    </a>
                  )}
                  {profile.social.github && (
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>🐙</span> GitHub
                    </a>
                  )}
                  {profile.social.linkedin && (
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>💼</span> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className={styles.main}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "posts" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts ({profile?.posts_count ?? 0})
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "about" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === "posts" && (
                <div className={styles.postsTab}>
                  <PostList
                    posts={posts}
                    setPosts={setPosts}
                    loading={postsLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    layout="grid"
                  />
                </div>
              )}

              {activeTab === "about" && (
                <div className={styles.aboutTab}>
                  <AuthorInfo
                    author={{
                      name: `${profile.first_name} ${profile.last_name}`,
                      title: profile.title,
                      bio: profile.about,
                      avatar: profile.avatar,
                      social: profile.social,
                      posts_count: profile?.posts_count ?? 0,
                      followers_count: profile?.followers_count ?? 0,
                      following_count: profile?.following_count ?? 0,
                    }}
                    showFollowButton={false}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {!isOwnProfile && (
        <ChatWindow
          user={{
            name: `${profile.first_name} ${profile.last_name}`,
            avatar: profile.avatar,
            username: profile.username,
          }}
          isOpen={isChatOpen}
          isMinimized={isChatMinimized}
          onClose={handleChatClose}
          onMinimize={handleChatMinimize}
        />
      )}
    </div>
  );
};

export default Profile;
