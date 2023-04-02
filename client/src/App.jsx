import axios from "axios"
import { useEffect, useState } from 'react'
import Modal from "./components/Modal"
import Table from "./components/Table"
const http = axios.create({ baseURL: '/' })

function App() {
  const [users, setUsers] = useState([])
  const [modal, setModal] = useState(false)
  const [user, setUser] = useState({
    address: "",
    description: "",
    email: "",
    image: "",
    name: "",
    phone: "",
    status: "active"
  })
  // const [loading, setSetloading] = useState(false)
  const [search, setSearch] = useState('')
  const [count, setCount] = useState(10)
  const [page, setPage] = useState(1)
  const [perpage, setPerPage] = useState(5)

  useEffect(() => {
    if(!search.trim()) getAll(page, perpage)
    else searchUser(search)
  }, [page, perpage, search])
  
  const getAll = async (pg, prg) => {
    // setSetloading(true)
    const { data } = await http.get(`/all?page=${pg}&perpage=${prg}`)
    setUsers(data.users)
    setCount(data.count)
    // setSetloading(false)
  }

  const setup = async (userdata) => {
    close()
    if(userdata.get('id')){
      const { data } = await http.put(`/edit/${userdata.get('id')}`, userdata, { headers: { 'Content-Type': 'multipart/form-data' } })
      console.log(data);
      setUsers(users.map(user => {
        if(user.id == userdata.get('id')) return data
        return user
      }))
    }else{
      const { data } = await http.post('/create', userdata, { headers: { 'Content-Type': 'multipart/form-data' } })
      console.log(data);
      if(page == Math.ceil(count/perpage)) setUsers([...users, data])
    }
  }

  const searchUser = async () => {
    // setSetloading(true)
    const { data } = await http.get(`/search/${search}?page=${page}&perpage=${perpage}`)
    setUsers(data.users)
    setCount(data.count)
    // setSetloading(false)
  }

  const editing = (userdata) => {
    setUser(userdata)
    setModal(true)
  }

  const close = () => {
    setUser({
      address: "",
      description: "",
      email: "",
      image: "",
      name: "",
      phone: "",
      status: "active"
    })
    setModal(false)
  }

  const deleteUser = async (id) => {
    setUsers(users.filter(user=>user.id !== id))
    await http.delete(`/delete/${id}`)
  }

  return (
    <div className="flex flex-col p-4 bg-dark">
      <Modal user={user} setup={setup} setUser={setUser} open={modal} close={close}/>
      <Table page={page} editUser={editing} setSearch={setSearch} perpage={perpage} setPage={setPage} setModal={setModal}
        setPerPage={setPerPage} users={users} count={count} delUser={deleteUser} />
    </div>
  );
}

export default App;
