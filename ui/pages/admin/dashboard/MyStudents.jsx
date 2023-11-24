import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';

const MyStudents = () => {
  const [myStudents, setMyStudents] = useState([]);

  useEffect(() => {
    Meteor.call('teacher.getMyStudents', Meteor.userId(), (error, result) => {
      if (!error) {
        setMyStudents(result);
      }
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">My Students</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Gender</th>
            <th className="py-2 px-4 border">Grade</th>
          </tr>
        </thead>
        <tbody>
          {myStudents.map((student) => (
            <tr key={student._id}>
              <td className="py-2 px-4 border">{student.name}</td>
              <td className="py-2 px-4 border">{student.gender}</td>
              <td className="py-2 px-4 border">{student.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyStudents;
