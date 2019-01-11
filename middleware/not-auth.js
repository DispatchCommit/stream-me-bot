
// If the user is authenticated redirect to home page

export default function ({ store, redirect }) {
    if (store.state.auth) {
        return redirect('/profile');
    }
}
