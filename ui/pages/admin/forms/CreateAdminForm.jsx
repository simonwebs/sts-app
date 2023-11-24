import React from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';

const CreateAdminForm = () => {

  const handleOpenForm = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create Admin',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Username">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Email">' +
        '<input type="password" id="swal-input3" class="swal2-input" placeholder="Password">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value
        ]
      }
    });

    if (formValues) {
      const [username, email, password] = formValues;
      Meteor.call('createAdmin', username, email, password, (err) => {
        if (err) {
          Swal.fire('Oops...', err.reason, 'error');
        } else {
          Swal.fire('Success', 'Admin created successfully', 'success');
        }
      });
    }
  };

  return (
    <button onClick={handleOpenForm}>Create Admin</button>
  );
};

export default CreateAdminForm;
