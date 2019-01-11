
// If the user is not authenticated redirect to login page

export default function ({redirect, store}) {
    console.log('checking middleware');

    if (!store.state.auth) {
        return redirect('/login');
    }
}
