import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfilePic from './ProfilePic'

export default function Comment({ comment, users }) {
  const [commentUser, setCommentUser] = useState({})
  const getUser = () => {
    let user = users.filter((user) => {
      return user.uid == comment.userId
    })
    setCommentUser(user[0])
  }

  useEffect(() => {
    getUser()
  }, [users])
  return (
    <div className="flex gap-x-2">
      <ProfilePic url={commentUser?.photoURL} className="h-7" />
      <div className="flex flex-col">
        <div className="flex gap-x-2">
          <span className="text-sm">
            <Link
              to={`/profile/${commentUser?.email?.split('@')[0]}`}
              className="text-sm font-bold hover:underline"
            >
              {commentUser?.email}
            </Link>{' '}
            {comment?.comment}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {moment(comment?.timestamp?.toDate()).fromNow()}
        </span>
      </div>
    </div>
  )
}
