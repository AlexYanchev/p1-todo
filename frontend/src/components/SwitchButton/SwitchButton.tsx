import { FC } from 'react';
import styles from './SwitchButton.module.css';

type Props = {
  labelText: string;
  publicTask: boolean;
  onChange: () => void;
};

const SwitchButton: FC<Props> = ({ labelText, publicTask, onChange }) => {
  return (
    <label className={styles.switchPublic_container}>
      <span className={styles.switchPublic_label}>{labelText}</span>
      <input
        className={styles.switchPublic_input}
        type='checkbox'
        name='switchPublic'
        defaultChecked={publicTask}
        onChange={onChange}
      />
      <div className={styles.switchPublic_switch}></div>
    </label>
  );
};
export default SwitchButton;
