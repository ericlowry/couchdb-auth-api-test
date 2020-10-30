import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useData, { DataProvider } from '../../state/useData';

const Edit = ({ widget, onSave, onCancel }) => {
  const w = { ...widget };

  const [name, setName] = useState(w.name || '');
  const [label, setLabel] = useState(w.label || '');
  return (
    <>
      <h1>Edit Widget</h1>
      <pre>{JSON.stringify(widget, null, 2)}</pre>
      <br />
      Name:{' '}
      <input
        name="name"
        value={name}
        onChange={ev => {
          setName(ev.target.value);
        }}
      />
      <br />
      Label:{' '}
      <input
        name="label"
        value={label}
        onChange={ev => {
          setLabel(ev.target.value);
        }}
      />
      <br />
      <br />
      <button
        onClick={() => {
          console.log(name,label);
          w.name = name,
          w.label = label,

          onSave(w);
        }}
      >
        Save
      </button>
      <br />
      <button onClick={() => onCancel()}>Cancel</button>
    </>
  );
};

const WidgetPage = ({ id }) => {
  const { loading, error, data = {} } = useData(`/widget/${id}`, []);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing = false;
  };

  if (loading) return 'Loading...';
  if (editing) return <Edit widget={data.widget} setEditing={setEditing} />;
  return (
    <>
      <h1>Widget</h1>
      {loading && <>Loading...</>}
      {error && <>Oops!</>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => setEditing(true)}>Edit</button>
    </>
  );
};

const Page = () => {
  const { id } = useParams();
  return (
    <DataProvider>
      <WidgetPage id={id} />
    </DataProvider>
  );
};

export default Page;
