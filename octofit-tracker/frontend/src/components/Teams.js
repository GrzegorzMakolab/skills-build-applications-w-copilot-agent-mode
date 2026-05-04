import ApiResourceView from './ApiResourceView';

function Teams() {
  return (
    <ApiResourceView
      resourceName="teams"
      title="Teams"
      description="Team data synchronized from the Django REST Framework backend."
    />
  );
}

export default Teams;
