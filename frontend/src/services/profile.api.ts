import axios from "./axios.customize"

const getProfile = async () => {
    return await axios.get<IBackendRes<IProfile>>('/profile')
}

const updateProfile = async (formData: FormData) => {
    return await axios.put<IBackendRes<IProfile>>('/profile', formData);
}

const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    return await axios.post<IBackendRes<[]>>('/profile/change-password', {
        currentPassword, newPassword, confirmPassword
    })
}

export { getProfile, updateProfile, updatePassword }