import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import Notifcation from "~/components/notifcation";


import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.user.create.useMutation()
  const currentUser = api.user.isAuthed.useQuery()
  const login = api.user.login.useMutation()
  const logout = api.user.logout.useMutation()
  const updateprofile = api.user.updateProfile.useMutation()
  const post = api.post.new.useMutation()
  const editedPost = api.post.edit.useMutation()
  const deletePost = api.post.delete.useMutation()
  const likePost = api.post.like.useMutation()
  const unlikePost = api.post.unlike.useMutation()
 // const getPost = api.post.getPost.useQuery({postid:'clh6c6rbc0007v5pgjn7k3u13'})
  const postComment = api.comment.new.useMutation()
  const editComment = api.comment.edit.useMutation()
  const deleteComment = api.comment.delete.useMutation()
  const likeComment = api.comment.like.useMutation()
  const unlikeComment = api.comment.unlike.useMutation()

  const getUser = api.userQuery.getUserProfile.useQuery({id:'DSbzEQK8NeWLKvV'})
  const getUserPosts = api.userQuery.getUserPosts.useQuery({id:'WQbptH7AdC0sN5q', postAmt:10, postSkip:0, commentAmt:10})
  const getMoreComments = api.userQuery.getMoreComments.useQuery({id:"clh6c6rbc0007v5pgjn7k3u13", commentAmt:10, commentSkip:0})
 const followUser = api.follow.followUser.useMutation()
  const unfollowUser = api.follow.unfollowUser.useMutation()

  const hasViewed = api.notify.hasViewed.useMutation()
  const followfollowing = api.follow.isFollowerFollowing.useQuery({id:'WRdW83qzlVMK2qe'})

  const geopost = api.geoPost.create.useMutation()
  const deletegeopost = api.geoPost.delete.useMutation()
  const editgeopost = api.geoPost.edit.useMutation()
  const likegeopost = api.geoPost.like.useMutation()
  const unlikegeopost = api.geoPost.unlike.useMutation()

    const postgeoComment = api.geoComment.new.useMutation()
  const editgeoComment = api.geoComment.edit.useMutation()
  const deletegeoComment = api.geoComment.delete.useMutation()
  const likegeoComment = api.geoComment.like.useMutation()
  const unlikegeoComment = api.geoComment.unlike.useMutation()

  const getGeoPost = api.geoPost.getPost.useQuery({postid:'nd7rox72k73bq091f2rc6m0p'}, {keepPreviousData:true})


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
   
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
          
            <button onClick={() => hello.mutate({email:'bonk23', password:'bonk23'})}>submit</button> 
            <button onClick={() => login.mutate({email:'tonk', password:'tonk'})}>LOGIN</button> 
              <button onClick={() => logout.mutate()}>LOGOUT</button> 
              <button onClick={() => updateprofile.mutate({bio:'bonk2', education:'bonk'})}>profile testa</button> 
             <button onClick={() => post.mutate({title:'bonk', content:'bonkahbonkbonk'})}>BONKPOST</button> 
              <button onClick={() => editedPost.mutate({postid:'clh6c6rbc0007v5pgjn7k3u13', title:'bonk11', content:'return of the bonk', meta:{url:'myurl.co222m'}})}>editbonk</button> 
             <button onClick={() => deletePost.mutate({postid:'clh6c6rbc0007v5pgjn7k3u13'})}>deleteBOnk</button> 
               <button onClick={() => likePost.mutate({postid:'clh8uzhng0001v52ck86fx00v', userid:'WQbptH7AdC0sN5q', currentUser:"WRdW83qzlVMK2qe" })}>likePost</button> 
                 <button onClick={() => unlikePost.mutate({postid:'clh8uzhng0001v52ck86fx00v'})}>unlikePost</button> 
                 <button onClick={() => postComment.mutate({title:'commentbonk',content:'commentbonk', postid:'clh8uzhng0001v52ck86fx00v'})}>comment</button> 
                 
                  <button onClick={() => editComment.mutate({commentid:'clh6jclu60001v5ogqxut88xf', title:'bonk11', content:'return of the bonk', meta:{url:'myurl.co222m'}})}>editcomment</button> 
                  <button onClick={() => deleteComment.mutate({commentid:'clh8y2x800017v52cb55gf9pl', postid:'clh8uzhng0001v52ck86fx00v'})}>deleteBOnk</button> 
               <button onClick={() => likeComment.mutate({postid:'clh8uzhng0001v52ck86fx00v', userid:'WQbptH7AdC0sN5q', currentUser:"WRdW83qzlVMK2qe", commentid:'clh8y2x800017v52cb55gf9pl'})}>likeComment</button> 
                 <button onClick={() => unlikeComment.mutate({commentid:'clh8y2x800017v52cb55gf9pl'})}>unlikeComment</button> 
           
                  <button onClick={() => followUser.mutate({currentUser:'bonk', id:'WRdW83qzlVMK2qe' })}>followuser</button>
                  <button onClick={() => unfollowUser.mutate({id:'WRdW83qzlVMK2qe' })}>unfollowuser</button>

                    <button onClick={() => hasViewed.mutate({notify_user_id:'clh7jyzv60000v5egber1xnkt' })}>mark notify as read</button>
                    <button onClick={() => geopost.mutate({title:'bonk', content:'bonkahbonkbonk', lat:51.4776883, lng:-2.5115698, type:'local2'})}>geopost</button>
                    <button onClick={() => deletegeopost.mutate({postid:'fh5jmfjficbonxma5rtk6sz0'})}>deletegeopost</button>
                    <button onClick={() => editgeopost.mutate({postid:'nd7rox72k73bq091f2rc6m0p', type:'boat' ,title:'bonk11', content:'return of the bonk', meta:{url:'myurl.co222m'}})}>editgeopost</button>
                    <button onClick={() => likegeopost.mutate({postid:'nd7rox72k73bq091f2rc6m0p', postUserid:'WQbptH7AdC0sN5q'})}>likegeopost</button>
            
                    <button onClick={() => postgeoComment.mutate({title:'commentbonk',content:'commentbonk', postid:'nd7rox72k73bq091f2rc6m0p'})}>geocomment</button> 
                 
                  <button onClick={() => editgeoComment.mutate({geo_commentid:'clhaowelj0007v56sx9l0wedu', title:'bonk11', content:'return of the bonk', meta:{url:'myurl.co222m'}})}>editgeocomment</button> 
                  <button onClick={() => deletegeoComment.mutate({commentid:'clhaowelj0007v56sx9l0wedu', postid:'nd7rox72k73bq091f2rc6m0p'})}>deletegeoBOnk</button> 
                 <button onClick={() => likegeoComment.mutate({postid:'nd7rox72k73bq091f2rc6m0p', userid:'WQbptH7AdC0sN5q', currentUser:"WRdW83qzlVMK2qe", commentid:'clhaowelj0007v56sx9l0wedu'})}>likegeoComment</button> 
                <button onClick={() => unlikegeoComment.mutate({commentid:'clhaowelj0007v56sx9l0wedu'})}>unlikegeoComment</button> 
                <button onClick={() => unlikegeopost.mutate({postid:'nd7rox72k73bq091f2rc6m0p'})}>unlikeGEOPost</button> 
            </main>
    </>
  );
};

export default Home;
