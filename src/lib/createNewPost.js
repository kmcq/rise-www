import newEditorState from './newEditorState.json';

export default () => {
  return {
    title: '+ New',
    slug: 'new',
    editing: true,
    editorState: newEditorState
  };
}
