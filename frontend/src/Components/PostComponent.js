import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PostComponent = ({ loggedIn }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [userFullname, setUserFullname] = useState('');
  const [user_Img, setUser_Img] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [editedPost, setEditedPost] = useState({ id: null, title: '', content: '' });

  useEffect(() => {
    if (!loggedIn) {
      navigate('/'); // Redirige a la página de inicio si no se ha iniciado sesión
    } else {
      fetchUser();
      fetchPosts();
    }
  }, [loggedIn, navigate]);

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuario', { credentials: 'include' });
      console.log(response);
      if (!response.ok) {
        throw new Error('Error de red al intentar obtener el usuario');
      }
      const user = await response.json();
      console.log(user);
      setUserFullname(user.fullname);
      setUser_Img(user.user_img);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };
  
  const createPost = async (e) => {
    e.preventDefault();

    const post = {
      title: title,
      content: content,
      usuarioId: usuarioId,
    };

    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
        credentials: 'include',
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        await fetchPosts();
      } else {
        const error = await response.json();
        console.error('Error al crear el post:', error.message);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      console.error('Error al obtener los posts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  };

  const editPost = async (postId) => {
    const updatedTitle = editedPost.title;
    const updatedContent = editedPost.content;

    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent,
        }),
      });

      if (response.ok) {
        await fetchPosts();
        setEditedPost({ id: null, title: '', content: '' });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al editar el post:', error);
    }
  };

  const handleEditTitleChange = (event) => {
    setEditedPost({ ...editedPost, title: event.target.value });
  };

  const handleEditContentChange = (event) => {
    setEditedPost({ ...editedPost, content: event.target.value });
  };

  return (
    <main className="container">
      <div className="row">
        <div className="col-lg-3 mt-5">
          <div className="mt-5 usuario-loged">
            <img src={user_Img} alt="Foto de perfil" />
            <p>{userFullname}</p>
          </div>
        </div>
        <div className="col-lg-6 mt-5">
          <div className="card mt-5 py-2">
            <form id="new-post-form" onSubmit={createPost}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="new-post-title"
                  placeholder="Título del post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  id="new-post-content"
                  rows="3"
                  placeholder="Contenido del post"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Publicar
              </button>
            </form>
            <div className="bg-light p-2 rounded-3 border border-2 mb-4" id="posts-container">
              {posts.map((post) => (
                <div key={post.id} className="post card mb-3">
                  {editedPost.id === post.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control card-header"
                        value={editedPost.title}
                        onChange={handleEditTitleChange}
                      />
                      <textarea
                        className="form-control card-body"
                        rows="3"
                        value={editedPost.content}
                        onChange={handleEditContentChange}
                      ></textarea>
                    </>
                  ) : (
                    <>
                      <div className="card-body d-flex align-items-center">
                        <img
                          src={post.user_img}
                          className="img-fluid rounded-circle me-3"
                          style={{ width: '50px', height: '50px' }}
                          alt="Foto de perfil"
                        />
                        <div>
                          <h5 className="card-title mb-0">{post.fullname}</h5>
                          <p className="card-text">
                            <strong>{post.title}</strong>
                          </p>
                        </div>
                      </div>
                      <p className="card-body">{post.content}</p>
                    </>
                  )}
                  <div className="card-footer">
                    {editedPost.id === post.id ? (
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => editPost(post.id)}
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() =>
                          setEditedPost({
                            id: post.id,
                            title: post.title,
                            content: post.content,
                          })
                        }
                      >
                        Editar
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deletePost(post.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-3 mt-5"></div>
      </div>
    </main>
  );
};
