import styles from './SearchPeople.module.css';
import UniversalForm from '../UniversalForm/UniversalForm';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getFoundPeople, getUserSlice } from '../../redux/slices/userSlice';
import { RefObject, Suspense, useEffect, useRef, useState } from 'react';
import { searchPeopleThunkAction } from '../../redux/actionsAndBuilders/user/searchPeople';
import FoundPeopleList from '../FoundPeopleList/FoundPeopleList';
import Spinner from '../Spinner/Spinner';
import { UserProfileType } from '../../types/userType';
import { useLocation } from 'react-router-dom';

const SearchPeople = () => {
  const location = useLocation();
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState({
    value: '',
  });
  const [openList, setOpenList] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [foundPeople, setFoundPeople] = useState<Array<UserProfileType>>([]);
  const foundPeopleRedux = useAppSelector(getFoundPeople);
  const pending = useAppSelector((state) => state.user.status === 'pending');

  useEffect(() => {
    setInputValue({ ...inputValue, value: '' });
  }, [location]);

  //   const onBlur = () => {
  //     // if(peopleListRef.current.)
  //     setFoundPeople([]);
  //   };

  const onFocus = () => {
    if (foundPeopleRedux.length && Boolean(inputValue.value)) {
      setFoundPeople(foundPeopleRedux);
    }
  };

  const searchPeopleDynamic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, value: e.currentTarget.value });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!e.currentTarget.value.length) {
      setFoundPeople([]);
      return;
    }

    const id = setTimeout(
      (currentValue) => {
        if (!userSlice.user) {
          return;
        }

        const searchParams = new URLSearchParams({
          value: currentValue,
        }).toString();
        dispatch(
          searchPeopleThunkAction({
            searchParams,
            dispatch,
            token: userSlice.user.token,
          })
        )
          .unwrap()
          .then((res) => {
            console.log('searchPeople успешно отработал');
            setOpenList(true);
            setFoundPeople(res.data);
          })
          .catch((err) => {
            console.log('searchPeople отработал с ошибкой: ', err);
          });
      },
      700,
      e.currentTarget.value
    );

    setTimeoutId(id);
  };

  return (
    <div className={styles.container}>
      <UniversalForm
        className={styles.form}
        onSubmit={() => {}}
        elements={[
          {
            typeElement: 'input',
            type: 'search',
            name: 'searchPeople',
            label: '',
            placeholder: 'Поиск друзей',
            value: inputValue.value,
            onChange: searchPeopleDynamic,
            // onBlur,
            onFocus,
          },
          {
            typeElement: 'button',
            type: 'submit',
            name: 'searchPeople',
            text: 'Поиск',
          },
        ]}
      />
      {openList && (
        <Suspense fallback={<Spinner />}>
          <FoundPeopleList
            closeCallback={setOpenList}
            peopleList={foundPeople}
          />
        </Suspense>
      )}
    </div>
  );
};
export default SearchPeople;
