import useSWR from 'swr'
import { useEffect } from 'react'
import { Axios } from '../lib/axios';
import cookie from 'react-cookies'
import { useLocation } from 'react-router-dom';

export const useAuth = () => {
    const location = useLocation()
    const currentPath = location.pathname
    
    // swr로 요청을 보낸 후, 데이터를 받아온다.
    // data는 성공시, error은 실패시 받아오고, data의 이름을 user로 바꾼다.
    // useSWR에 첫번째 파라미터는 주소로 그 자체가 키가 된다.
    // useSWR은 두번째 파라미터로 오는 함수를 사용해서 요청을 보낸다. 이를 로컬 어딘가에 저장한다. 
    // revalidate 요청이 없다면, 계속 로컬에 저장된 데이터를 가져온다. 이를 캐싱된 상태라고 한다.
    // revalidate는 특정 useSWR의 두번째 파라미터에 오는 함수를 호출해서 로컬에 저장되어있는 값을 바꾼다는 의미
    // 이를 캐시를 갱신한다고 한다.
    // mutate는 함수다. 언제 데이터를 revalidate 할지 컨트롤 할 수 있다.
    // mutate 함수에는 파라미터로 useSWR의 키를 주어야 하지만, 어떤 useSWR의 반환값으로 나온 mutate는 key가 이미 바인딩 되어있어서, key를 넘기지 않아도 된다.
    const { data: user, error, mutate, isLoading } = useSWR('http://localhost:3012/user/info', () =>
        Axios
            .get('http://localhost:3012/user/info')
            .then(res => res.data)
            
    )

    const logout = async () => {
        cookie.remove('auth_token')
        window.location.href = '/'
    }

    useEffect(() => {
        if (error && currentPath !== '/login'){
            alert('로그인이 만료 되었습니다.')
            cookie.remove('auth_token')
            window.location.href = '/login'
        }
    }, [user, error])

    return {
        user,
        logout,
        isLoading,
    }
}

