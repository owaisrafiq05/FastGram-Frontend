'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
  PlusIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UsersIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import {
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  addMember,
  removeMember,
  listMembers,
  createGroupPost,
  listGroupPosts,
  deleteGroupPost,
  listMyGroups,
  listGroupsByUser,
} from '@/services/groups';
import { getMyProfile, getUserByUsername } from '@/services/users';
import type { Group, GroupMember, GroupPost } from '@/types/groups';

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) loadGroupsForUser(currentUserId);
  }, [currentUserId]);

  const loadCurrentUser = async () => {
    try {
      const res = await getMyProfile();
      setCurrentUserId(res.data.user.id);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  const loadMyGroups = async () => {
    try {
      const groupsList = await listMyGroups();
      setGroups(groupsList);
    } catch (err) {
      console.error('Failed to load groups:', err);
    }
  };

  const loadGroupsForUser = async (userId: number) => {
    try {
      const groupsList = await listGroupsByUser(userId);
      setGroups(groupsList);
    } catch (err) {
      console.error('Failed to load user groups:', err);
    }
  };

  const loadGroupDetails = async (groupId: number) => {
    setLoading(true);
    try {
      const group = await getGroup(groupId);
      setSelectedGroup(group);
      
      const [membersData, postsData] = await Promise.all([
        listMembers(groupId),
        listGroupPosts(groupId),
      ]);
      
      setMembers(membersData);
      setPosts(postsData);
    } catch (err: any) {
      alert(err.message || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (name: string, description: string, isPrivate: boolean) => {
    try {
      const group = await createGroup({ name, description, isPrivate });
      setGroups([group, ...groups]);
      setShowCreateModal(false);
      loadGroupDetails(group.id);
      alert('Group created successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to create group');
    }
  };

  const handleUpdateGroup = async (name: string, description: string, isPrivate: boolean) => {
    if (!selectedGroup) return;
    try {
      const updated = await updateGroup(selectedGroup.id, { name, description, isPrivate });
      setSelectedGroup(updated);
      setShowEditModal(false);
      alert('Group updated successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to update group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    if (!confirm('Delete this group? This cannot be undone.')) return;
    try {
      await deleteGroup(selectedGroup.id);
      setSelectedGroup(null);
      setGroups(groups.filter((g) => g.id !== selectedGroup.id));
      alert('Group deleted successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to delete group');
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      await joinGroup(groupId);
      loadGroupDetails(groupId);
      alert('Joined group successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to join group');
    }
  };

  const handleAddMember = async (userId: number) => {
    if (!selectedGroup) return;
    try {
      await addMember(selectedGroup.id, { userId });
      // Reload members to get updated list
      const membersData = await listMembers(selectedGroup.id);
      setMembers(membersData);
      if (selectedGroup) {
        setSelectedGroup({ ...selectedGroup, membersCount: selectedGroup.membersCount + 1 });
      }
      setShowAddMemberModal(false);
      alert('Member added successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!selectedGroup) return;
    if (!confirm('Remove this member?')) return;
    try {
      await removeMember(selectedGroup.id, memberId);
      setMembers(members.filter((m) => m.userId !== memberId));
      if (selectedGroup) {
        setSelectedGroup({ ...selectedGroup, membersCount: selectedGroup.membersCount - 1 });
      }
      alert('Member removed successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    }
  };

  const handleCreatePost = async (file: File, caption: string) => {
    if (!selectedGroup) return;
    try {
      const post = await createGroupPost(selectedGroup.id, file, caption);
      setPosts([post, ...posts]);
      setShowCreatePostModal(false);
      alert('Post created successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to create post');
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!selectedGroup) return;
    if (!confirm('Delete this post?')) return;
    try {
      await deleteGroupPost(selectedGroup.id, postId);
      setPosts(posts.filter((p) => p.id !== postId));
      alert('Post deleted successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar currentPage="groups" />
        <div className="flex-1 ml-64">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Groups</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Create Group
              </button>
            </div>

            <div className="text-center py-12 text-gray-400">
              <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              {groups.length === 0 ? (
                <p>No groups found. Create a group or ask to be added to one!</p>
              ) : (
                <>
                  <p className="mb-4">Select a group to view and post</p>
                  <div className="mt-8 space-y-3 max-w-2xl mx-auto">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => loadGroupDetails(group.id)}
                        className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                              <UserGroupIcon className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold">{group.name}</h3>
                              <p className="text-sm text-gray-400">
                                {group.membersCount} members • {group.isPrivate ? 'Private' : 'Public'}
                              </p>
                            </div>
                          </div>
                          <div className="text-gray-400">→</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {showCreateModal && (
          <CreateGroupModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateGroup}
          />
        )}
      </div>
    );
  }

  const isAdmin = selectedGroup.ownerId === currentUserId;
  const isMember = members.some((m) => m.userId === currentUserId);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar currentPage="groups" />

      <div className="flex-1 ml-64">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Back button */}
          <button
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Groups
          </button>

          {/* Group Header */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                <UserGroupIcon className="w-12 h-12 text-gray-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedGroup.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        {selectedGroup.isPrivate ? (
                          <LockClosedIcon className="w-4 h-4" />
                        ) : (
                          <GlobeAltIcon className="w-4 h-4" />
                        )}
                        <span>{selectedGroup.isPrivate ? 'Private' : 'Public'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        <span>{selectedGroup.membersCount} members</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isMember ? (
                      <>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setShowEditModal(true)}
                              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteGroup}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleJoinGroup(selectedGroup.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Join Group
                      </button>
                    )}
                  </div>
                </div>

                {selectedGroup.description && (
                  <p className="text-gray-300 mt-4">{selectedGroup.description}</p>
                )}
              </div>
            </div>
          </div>

          {isMember && (
            <>
              {/* Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-6 border-b border-gray-800">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`pb-3 px-2 font-medium transition-colors border-b-2 ${
                      activeTab === 'posts'
                        ? 'text-white border-white'
                        : 'text-gray-400 border-transparent hover:text-gray-300'
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`pb-3 px-2 font-medium transition-colors border-b-2 ${
                      activeTab === 'members'
                        ? 'text-white border-white'
                        : 'text-gray-400 border-transparent hover:text-gray-300'
                    }`}
                  >
                    Members ({members.length})
                  </button>
                </div>

                {activeTab === 'posts' && (
                  <button
                    onClick={() => setShowCreatePostModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Post
                  </button>
                )}

                {activeTab === 'members' && isAdmin && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    Add Member
                  </button>
                )}
              </div>

              {/* Content */}
              {activeTab === 'posts' ? (
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No posts yet</div>
                  ) : (
                    posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        canDelete={isAdmin || post.userId === currentUserId}
                        onDelete={() => handleDeletePost(post.id)}
                      />
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <MemberCard
                      key={member.userId}
                      member={member}
                      isAdmin={isAdmin}
                      canRemove={isAdmin && member.userId !== currentUserId}
                      onRemove={() => handleRemoveMember(member.userId)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
      {showEditModal && selectedGroup && (
        <EditGroupModal
          group={selectedGroup}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateGroup}
        />
      )}
      {showCreatePostModal && (
        <CreatePostModal
          onClose={() => setShowCreatePostModal(false)}
          onCreate={handleCreatePost}
        />
      )}
      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAdd={handleAddMember}
          existingMembers={members}
        />
      )}
    </div>
  );
}

// Post Card Component
function PostCard({
  post,
  canDelete,
  onDelete,
}: {
  post: GroupPost;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={post.profilePictureUrl || '/images/portrait-avatar.png'}
            alt={post.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-sm">{post.username}</div>
            <div className="text-xs text-gray-400">{post.fullName}</div>
          </div>
        </div>
        {canDelete && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="w-full object-cover" />
      )}

      <div className="px-4 py-3">
        {post.caption && <p className="text-sm">{post.caption}</p>}
        <div className="text-xs text-gray-500 mt-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// Member Card Component
function MemberCard({
  member,
  isAdmin,
  canRemove,
  onRemove,
}: {
  member: GroupMember;
  isAdmin: boolean;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center gap-4">
      <img
        src={member.profilePictureUrl || '/images/portrait-avatar.png'}
        alt={member.username}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="font-semibold">{member.username}</div>
        <div className="text-sm text-gray-400">{member.fullName}</div>
      </div>
      <span className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded">
        {member.role}
      </span>
      {canRemove && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onRemove();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors rounded-lg"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Create Group Modal
function CreateGroupModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, description: string, isPrivate: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 1 || name.length > 150) {
      alert('Group name must be between 1 and 150 characters');
      return;
    }
    onCreate(name.trim(), description.trim(), isPrivate);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Group</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Group Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 focus:border-blue-600"
              placeholder="Enter group name"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 focus:border-blue-600 resize-none"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Make this group private</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}

// Edit Group Modal
function EditGroupModal({
  group,
  onClose,
  onUpdate,
}: {
  group: Group;
  onClose: () => void;
  onUpdate: (name: string, description: string, isPrivate: boolean) => void;
}) {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || '');
  const [isPrivate, setIsPrivate] = useState(group.isPrivate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 1 || name.length > 150) {
      alert('Group name must be between 1 and 150 characters');
      return;
    }
    onUpdate(name.trim(), description.trim(), isPrivate);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Edit Group</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Group Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 focus:border-blue-600"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 focus:border-blue-600 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Private group</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Member Modal
function AddMemberModal({
  onClose,
  onAdd,
  existingMembers,
}: {
  onClose: () => void;
  onAdd: (userId: number) => void;
  existingMembers: GroupMember[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setSearching(true);
        setError('');
        try {
          const res = await getUserByUsername(searchQuery.trim());
          setSearchResult(res.data.user);
        } catch (err: any) {
          setSearchResult(null);
          setError('User not found');
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResult(null);
        setError('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdd = () => {
    if (!searchResult) return;
    
    // Check if user is already a member
    if (existingMembers.some((m) => m.userId === searchResult.id)) {
      setError('User is already a member of this group');
      return;
    }
    
    onAdd(searchResult.id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Add Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search User by Username</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 outline-none border border-gray-700 focus:border-blue-600"
                placeholder="Enter username..."
              />
            </div>
          </div>

          {searching && (
            <div className="text-center py-4 text-gray-400">Searching...</div>
          )}

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          {searchResult && !searching && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={searchResult.profilePictureUrl || '/images/portrait-avatar.png'}
                  alt={searchResult.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold">{searchResult.username}</div>
                  <div className="text-sm text-gray-400">{searchResult.fullName}</div>
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Add to Group
              </button>
            </div>
          )}

          {!searchResult && !searching && searchQuery.trim().length >= 2 && !error && (
            <div className="text-center py-4 text-gray-400">No user found</div>
          )}

          {searchQuery.trim().length < 2 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Create Post Modal
function CreatePostModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (file: File, caption: string) => void;
}) {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image');
      return;
    }
    onCreate(file, caption.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image *</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="post-image"
                required
              />
              <label
                htmlFor="post-image"
                className="block w-full aspect-square bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 cursor-pointer overflow-hidden"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <PhotoIcon className="w-12 h-12 mb-2" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 focus:border-blue-600 resize-none"
              placeholder="Write a caption..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
