import React from 'react';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Header(props) {
  const { player } = props;
  const { name, score, gravatarEmail } = player;
  const hash = md5(gravatarEmail).toString();

  return (
    <header>
      <img
        src={ `https://www.gravatar.com/avatar/${hash}` }
        alt={ `avatar do ${name}` }
        data-testid="header-profil-picture"
      />
      <div data-testid="header-player-name">
        Jogador:
        {' '}
        {name}
      </div>
      <div data-testid="header-score">
        Pontos:
        {' '}
        {score}
      </div>
    </header>
  );
}

Header.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    gravatarEmail: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  player: state.player,
});

export default connect(mapStateToProps)(Header);
