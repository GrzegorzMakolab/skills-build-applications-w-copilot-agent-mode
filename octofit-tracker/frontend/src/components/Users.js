import ApiResourceView from './ApiResourceView';

function Users() {
  return (
    <ApiResourceView
      resourceName="users"
      title="Users"
      description="User profiles fetched from the backend REST API."
    />
  );
}

export default Users;
