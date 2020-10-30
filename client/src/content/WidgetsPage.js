import { Link } from 'react-router-dom';
import useData, { DataProvider } from '../state/useData';

const id = (_id) => _id.split(':').slice(1).join(':');

const Widget = ({ widget: w }) => (
  <div>
    <Link to={`/widget/${id(w._id)}`}>{w.label}</Link>
  </div>
);

const WidgetsPage = () => {
  const { loading, error, data = {} } = useData('/widget', []);
  return (
    <>
      <h1>Widgets</h1>
      {loading && <>Loading...</>}
      {error && <>Oops!</>}
      {data &&
        data.widgets &&
        data.widgets.map(w => <Widget key={w._id} widget={w} />)}
    </>
  );
};

const Page = () => (
  <DataProvider>
    <WidgetsPage />
  </DataProvider>
);

export default Page;