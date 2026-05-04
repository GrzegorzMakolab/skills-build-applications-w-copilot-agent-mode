import ApiResourceView from './ApiResourceView';

function Leaderboard() {
  return (
    <ApiResourceView
      resourceName="leaderboard"
      title="Leaderboard"
      description="Leaderboard standings loaded from the backend REST API."
    />
  );
}

export default Leaderboard;
