
// export async function fetchUserProfile() {
//     try {
//         const apiService = createServerApiService();
//         const userData = await apiService.get('/users/me');
//         return userData;
//     } catch (error) {
//         console.log('Failed to fetch user profile:', error);
//         return null;
//     }
// }

const About = async () => {

    // const userData = await fetchUserProfile();

    // if (!userData) {

    //     return <div>Unable to load profile</div>;
    // }

    return (
        <div>
            <h1>Profile</h1>

        </div>
    );
}

export default About;