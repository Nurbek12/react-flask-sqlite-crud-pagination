export default function TableItem({ user, deleteUser, updateUser }) {

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-6 py-4">
                {user?.id}
            </td>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <img src={'/files/'+user?.image} alt="" className="w-10 h-10 rounded-full" />
            </th>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {user?.name}
            </th>
            <td className="px-6 py-4">
                {user.address}
            </td>
            <td className="px-6 py-4">
                {user?.phone}
            </td>
            <td className="px-6 py-4">
                {user?.email}
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2 pb-1 mr-2 text-sm font-medium text-white bg-blue-100 rounded dark:bg-blue-900 dark:text-white-200">
                {user?.status}
                </span>
            </td>
            <td className="px-6 py-4">
                {user?.description}
            </td>
            <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                <a href="#" className="text-yellow-300 dark:text-yellow-300 hover:underline mr-3" onClick={()=>updateUser(user)}>
                    <i className="mdi mdi-pencil"></i>
                </a>
                <a href="#" className="dark:text-blue-500 hover:underline" onClick={()=>{ if(window.confirm('Are you sure you want to delete this user?')) deleteUser(user.id) }}>
                    <i className="mdi mdi-delete text-red-500"></i>
                </a>
            </td>
        </tr>
    )
}