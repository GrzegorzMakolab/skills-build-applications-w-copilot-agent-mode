import ApiResourceView from './ApiResourceView';

function Activities() {
  return (
    <ApiResourceView
      resourceName="activities"
      title="Activities"
      description="Activity log entries fetched from the Django REST Framework endpoint."
    />
  );
}

export default Activities;
