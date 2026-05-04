import ApiResourceView from './ApiResourceView';

function Workouts() {
  return (
    <ApiResourceView
      resourceName="workouts"
      title="Workouts"
      description="Workout suggestions and plans loaded from the REST API."
    />
  );
}

export default Workouts;
