import TableItem from "./TableItem"
import TableBar from "./TableBar"

export default function Table({ users, count, editUser, page, perpage, setPage, setModal, setSearch, setPerPage, delUser }) {
    const plusPage = () => {
        if(perpage*(page-1)+users.length >= count)return
        setPage(p=>p+1)
    }
    const changePage = (i) => {
        if(i === page)return
        setPage(i)
    }
    const minusPage = () => {
        if(page===1)return
        setPage(p=>p-1)
    }
    return (
        <div className="relative overflow-x-auto shadow-md shadow-lg">
            <TableBar selectLeng={setPerPage} openModal={setModal} search={setSearch} />
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-hidden rounded-lg">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            ID
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Image
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Name
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Address
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Phonenumber
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Email
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Status
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Description
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-100 uppercase">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                {users.map((user, i) => <TableItem updateUser={editUser} user={user} key={i} deleteUser={delUser} />)}
                </tbody>
            </table>
            <nav className="flex items-center justify-between pt-3 px-2" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">{perpage*(page-1)+1}-{perpage*(page-1)+users.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{count}</span></span>
                <ul className="inline-flex items-center -space-x-px">
                    <li onClick={minusPage} className="cursor-pointer">
                        <a className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <i className="mdi mdi-chevron-left"></i>
                        </a>
                    </li>
                    { Array(Math.ceil(count/perpage)).fill().map((_, i) => (
                        <li key={i} onClick={()=>changePage(i+1)} className="cursor-pointer">
                            <a className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-400 hover:text-gray-700 dark:bg-gray-${i+1==page?'600':'800'} dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                                {i+1}
                            </a>
                        </li>
                    )) }
                    <li onClick={plusPage} className="cursor-pointer">
                        <a className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <i className="mdi mdi-chevron-right"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}