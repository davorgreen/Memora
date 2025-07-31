import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchPeopleYouMayKnow, filterPeople } from './peopleService';
import type { User } from '../../types/User';

export const usePeopleYouMayKnow = (currentUser: User | null) => {
	const [people, setPeople] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPeople = async () => {
		if (!currentUser?._id) return;
		setLoading(true);
		try {
			const all = await fetchPeopleYouMayKnow();
			const filtered = filterPeople(all, currentUser);
			setPeople(filtered);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPeople();
	}, [currentUser?.friends]);

	return { people, loading, error, setPeople };
};
