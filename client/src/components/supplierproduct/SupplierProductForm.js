/**
 * Author: iracanyes
 * Date: 22/09/2019
 * Description: Formulaire d'ajout de produits par un fournisseur
 */
import React,{ Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import {
  Button,
  Col,
  Row,
  Fieldset
} from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { create } from "../../actions/supplierproduct/create";
import { listByName } from "../../actions/category/list";
import { getNames } from '../../actions/product/getNames';

import PropTypes from 'prop-types';
import SupplierProductImageInput from "./SupplierProductImageInput";
import SupplierProductCategoryImageInput from "./SupplierProductCategoryImageInput";

class SupplierProductForm extends React.Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    listByName: PropTypes.func.isRequired,
    retrievedCategories: PropTypes.array,
    getNames: PropTypes.func.isRequired,
    retrievedProducts: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      submitted: false
    };

    this.auth = this.auth.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeImage= this.handleChangeImage.bind(this);
    this.renderProductImageForm = this.renderProductImageForm.bind(this);
    this.showProductForm = this.showProductForm.bind(this);
    this.showProductCategoryForm = this.showProductCategoryForm.bind(this);
  }

  componentDidMount() {

    this.auth();

    /* Récupération des catégories de produits */
    this.props.listByName();

    /* Récupération des noms de produits déjà existants */
    this.props.getNames();

  }

  auth()
  {
    if(localStorage.getItem("token") !== null )
    {
      const userToken = JSON.parse(atob(localStorage.getItem("token").split('.')[1]));

      console.log("userToken",userToken);

      if(userToken && !userToken.roles.includes('ROLE_SUPPLIER'))
      {

        this.props.history.push({ pathname: '../../'});
        sessionStorage.removeItem('flash-message');
        sessionStorage.setItem('flash-message', JSON.stringify({message: "Vous n'êtes pas autorisé à publier du contenu sur la plateforme"}));
      }
    }else{
      this.props.history.push({ pathname: "../../login", state: { from : window.location.pathname }});
      sessionStorage.removeItem('flash-message');
      sessionStorage.setItem('flash-message', JSON.stringify({message: "Une authentification est nécessaire avant de publier un produit sur la plateforme."}));
    }
  }

  handleChangeImage(event, input)
  {
    //event.preventDefault();


    let images = [];

    if(event.target.files.length === 1)
    {
      let imageFile = event.target.files[0];
      if(imageFile) {
        const localImageUrl = URL.createObjectURL(imageFile);
        let imageObject = new window.Image();

        console.log("imageFile",imageFile);

        imageFile.file = localImageUrl;
        console.log("imageObject", imageObject);

        URL.revokeObjectURL(imageFile);

      }


    }else{
      event.target.files.map((image, index) => {
        let imageFile = event.target.files[index];
        if(imageFile){
          const localImageUrl = URL.createObjectURL(imageFile);


          imageFile.file = localImageUrl;

          URL.revokeObjectURL(imageFile);

        }
      })
    }


  }

  handleSubmit(e)
  {
    e.preventDefault();

    this.setState({ submitted: true });

    // Récupération des données de formulaires
    const data = new FormData(document.getElementById('supplier-product-form'));

    if(data != null)
    {
      this.props.create(data, this.props.history)
    }

  }

  renderProductImageForm = ({ fields, meta: { error } }) => {
    const { intl } = this.props;
    return (
      <div>
        <Row>
          <Col>
            <button className={"btn btn-outline-primary"}
                    onClick={(e) => {
                      e.preventDefault();
                      fields.push();
                    }}

            >
              Ajouter une image
            </button>
          </Col>
        </Row>
        {fields.map((image, index) => (
          <Row key={index}>
            <Col>

              <Field
                component={SupplierProductImageInput}
                name={`${image}[src]`}
                type="file"
                labelText={intl.formatMessage({
                  id: "app.product.item.image",
                  defaultMessage: "Image du produit",
                  description: "Product item - image"
                })}
                accept="image/jpeg,image/png,image/jpg"
                onChange={(event) => this.handleChangeImage(event)}
                value={""}
              />
              <Button
                outline
                color={"danger"}
                title="Supprimer l'image"
                onClick={() => fields.remove(index)}
              >
                Supprimer l'image
              </Button>
            </Col>
            <Col>
              <Field
                component={this.renderField}
                name={`${image}[title]`}
                type="text"
                placeholder="Titre de l'image"
                labelText={intl.formatMessage({
                  id: "app.image.item.title",
                  defaultMessage: "Titre de l'image",
                  description: "Image item - title"
                })}

              />
              <Field
                component={this.renderField}
                name={`${image}[place]`}
                type="number"
                min={"0"}
                max={"10"}
                step={"1"}
                placeholder={index}
                labelText={intl.formatMessage({
                  id: "app.image.item.place",
                  defaultMessage: "Place de l'image",
                  description: "Image item - place"
                })}
                value={index}
                list={"image-place"}
              />
            </Col>
          </Row>
        ))}
        {error && <div className="error">{error}</div>}
      </div>
    )
  };

  showProductForm()
  {
    if(document.getElementById('product-form').classList.contains('d-none'))
    {
      /* Ré-initialisation du choix de catégorie */
      document.getElementById('product-name-select').selectedIndex = 0;
      /* Désactivation du champ de sélection de catégorie de produit */
      document.getElementById('product-name-select').setAttribute('disabled', 'disabled');
      /* Affichage du formulaire  */
      document.getElementById('product-form').classList.remove("d-none");

    }else{
      /* Si le formulaire est affiché */
      // Activation du champ de sélection de la catégorie du produit
      document.getElementById('product-name-select').removeAttribute('disabled');
      // Cacher le formulaire de proposition de catégorie
      document.getElementById('product-form').classList.add('d-none');
    }

  }

  showProductCategoryForm()
  {
    if(document.getElementById('product-category-form').classList.contains('d-none'))
    {
      /* Ré-initialisation du choix de catégorie */
      document.getElementById('product-category-select').selectedIndex = 0;
      /* Désactivation du champ de sélection de catégorie de produit */
      document.getElementById('product-category-select').setAttribute('disabled', 'disabled');
      /* Affichage du formulaire  */
      document.getElementById('product-category-form').classList.remove("d-none");

    }else{
      /* Si le formulaire est affiché */
      // Activation du champ de sélection de la catégorie du produit
      document.getElementById('product-category-select').removeAttribute('disabled');
      // Cacher le formulaire de proposition de catégorie
      document.getElementById('product-category-form').classList.add('d-none');
    }

  }

  renderField = data => {
    if(data.type !== "file")
    {
      data.input.className = 'form-control';
    }


    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`user_${data.input.name}`}
          className="form-control-label"
        >
          {data.labelText}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`user_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };


  render() {
    const { intl  } = this.props;
    /* Authentification de l'utilisateur */
    this.auth();

    return (
      <Fragment>
        <div className={"supplier-product-form my-3"}>
          <h4 className={'text-center'}>
            <FormattedMessage  id={"app.page.supplier_product.title.add_product"}
                               defaultMessage="Ajouter un produit"
                               description="Page Supplier product - Add form title"
            />
          </h4>
          {this.props.error && (
            <div className="alert alert-danger" role="alert">
              <span className="fa fa-exclamation-triangle text-center" aria-hidden="true" />{' '}
              {this.props.error}
            </div>
          )}
          <form
            id="supplier-product-form"
            name="supplier-product"
            className={"col-lg-6 mx-auto px-3"}
            onSubmit={this.handleSubmit}
            autoComplete={"on"}
          >
            <fieldset className={"mb-2"}>
              <legend>Information sur le produit</legend>
              <Row>
                <Col className={'col-8 mb-3'}>
                  <label
                    htmlFor={'product[id]'}
                    className="form-control-label"
                  >
                    <FormattedMessage  id={"app.product.item.existingProducts"}
                                       defaultMessage="Produits existants"
                                       description="Product item - existing product"

                    />
                  </label>
                  &nbsp;:&nbsp;
                  <Field
                    component={"select"}
                    name="product[id]"
                    id={"product-name-select"}
                    type="select"
                    className={'custom-select w-100 ml-2 col-2'}
                    style={{minWidth: "100%"}}
                    onChange={this.handleChange}
                  >
                    <option value="">--- Choisir parmi les produits existants ---</option>
                    {this.props.retrievedProducts !== null && this.props.retrievedProducts.names.map(item => (
                      <option value={item.id} key={item.id}>
                        { item.title }
                      </option>
                    ))}

                  </Field>
                </Col>
                <Col>
                  <Button outline
                          color={'primary'}
                          style={{position:"absolute", bottom:"1rem"}}
                          onClick={() => this.showProductForm()}
                  >
                    Proposer un nouveau produit
                  </Button>
                </Col>

              </Row>
              <div id="product-form" className={"d-none"}>
                <fieldset>
                  <legend>Infos publiés sur la plateforme</legend>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="product[title]"
                        type="text"
                        placeholder="Nom et modèle du produit"
                        labelText={intl.formatMessage({
                          id: "app.product.item.title",
                          defaultMessage: "Nom du produit",
                          description: "Product item - title"
                        })}

                      />
                    </Col>
                  </Row>
                  <Row className={'pt-3'}>
                    <Col>
                      <div className={'d-flex-row'}>
                        <label
                          htmlFor={'product[resume]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.product.item.resume"}
                                             defaultMessage="Description résumés"
                                             description="Product item - resume"
                          />
                        </label>
                        <textarea name="product[resume]" className={'form-control w-100'} defaultValue={"The cat was playing in the garden."}>

                        </textarea>
                      </div>
                    </Col>
                  </Row>
                  <Row className={'pt-3'}>
                    <Col>
                      <div className={'d-flex-row'}>
                        <label
                          htmlFor={'product[description]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.product.item.description"}
                                             defaultMessage="Description"
                                             description="Product item - description"
                          />
                        </label>
                        <textarea name="product[description]" className={'form-control w-100'} defaultValue={"The cat was playing in the garden."}>

                        </textarea>
                      </div>
                    </Col>
                  </Row>
                  <Row className={'mt-3'}>
                    <Col className={'col-8 mb-3'}>
                      <label
                        htmlFor={'product[countryOrigin]'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.product.item.country_origin"}
                                           defaultMessage="Origine du produit"
                                           description="Product item - country of origin"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      <Field
                        component={"select"}
                        name="product[countryOrigin]"
                        id={"product-country-origin-select"}
                        type="select"
                        className={'custom-select ml-2 col-2'}
                        style={{minWidth: "100%"}}
                        onChange={this.handleChange}
                      >
                        <option value="">--- Choisir parmi les pays d'orgine autorisés ---</option>
                        {[
                          {id: "1", country: 'Burundi'},
                          {id: 2, country: "Congo"},
                          {id: 3, country: "Ouganda"},
                          {id: 4, country: "Rwanda"},
                          {id: 5, country: "Tanzanie"}
                         ].map(item => (
                          <option value={item.id} key={item.id}>
                            { item.country }
                          </option>
                        ))}

                      </Field>
                    </Col>

                  </Row>
                </fieldset>

                <fieldset>
                  <legend>Dimension du produit</legend>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="product[weight]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.weight",
                          defaultMessage: "Poids",
                          description: "Product item - weight"
                        })}
                        value={0.0}
                        normalize={v => parseFloat(v)}
                      />
                      <Field
                        component={this.renderField}
                        name="product[length]"
                        type="number"
                        step="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.length",
                          defaultMessage: "Longueur",
                          description: "Product item - length"
                        })}
                        normalize={v => parseFloat(v)}
                      />
                    </Col>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="product[width]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.width",
                          defaultMessage: "Largeur",
                          description: "Product item - width"
                        })}
                        normalize={v => parseFloat(v)}
                      />
                      <Field
                        component={this.renderField}
                        name="product[height]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.height",
                          defaultMessage: "Hauteur",
                          description: "Product item - height"
                        })}
                        normalize={v => parseFloat(v)}
                      />

                    </Col>
                  </Row>
                </fieldset>

                <fieldset className={"mb-2"}>
                  <legend>Catégorie du produit</legend>
                  <Row>
                    <Col className={'mb-3'}>
                      <label
                        htmlFor={'product[category]'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.product.item.category"}
                                           defaultMessage="Catégorie du produit"
                                           description="Product item - category"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      <Field
                        component={"select"}
                        name="product[category][id]"
                        id={"product-category-select"}
                        type="select"
                        className={'custom-select w-100 ml-2 col-2'}
                        style={{minWidth: "max-content"}}
                        onChange={this.handleChange}
                      >
                        <option value="">--- Choisir une catégorie de produit ---</option>
                        {this.props.retrievedCategories && this.props.retrievedCategories.map(item => (
                          <option value={item.id} key={item.id}>
                            { item.name }
                          </option>
                        ))}

                      </Field>
                    </Col>
                    <Col>
                      <Button outline
                              color={'primary'}
                              style={{position:"absolute", bottom:"1rem"}}
                              onClick={() => this.showProductCategoryForm()}
                      >
                        Proposer une catégorie
                      </Button>
                    </Col>

                  </Row>
                  <div id={"product-category-form"} className={'d-none'}>
                    <Row >
                      <Col>
                        <Field
                          component={this.renderField}
                          name="product[category][name]"
                          type="text"
                          placeholder="Nom de la catégorie"
                          labelText={intl.formatMessage({
                            id: "app.category.item.name",
                            defaultMessage: "Nom de la catégorie",
                            description: "Category item - name"
                          })}
                        />
                      </Col>

                    </Row>
                    <Row>
                      <Col>
                        <label htmlFor="product[category][description]">
                          <FormattedMessage id={"app.category.item.description"}
                                            defaultMessage={"Description de la catégorie"}
                                            description={"Category item - description"}
                          />
                        </label>
                        <textarea name="product[category][description]" id="product-category-description" defaultValue={"Une brève description de la catégorie"} className={'form-control'}>

                      </textarea>

                      </Col>
                    </Row>
                    <Row className={'mt-3'}>
                      <Col>
                        <Field
                          component={SupplierProductCategoryImageInput}
                          name={`product[category][image][src]`}
                          type="file"
                          labelText={intl.formatMessage({
                            id: "app.category.item.image",
                            defaultMessage: "Image de la catégorie",
                            description: "Category item - image"
                          })}
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={(event) => this.handleChangeImage(event)}
                          value={""}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name={`product[category][image][title]`}
                          type="text"
                          placeholder="Titre de l'image"
                          labelText={intl.formatMessage({
                            id: "app.image.item.title",
                            defaultMessage: "Titre de l'image",
                            description: "Image item - title"
                          })}

                        />
                        <Field
                          component={this.renderField}
                          name={`product[category][image][place]`}
                          type="number"
                          min={"0"}
                          max={"10"}
                          step={"1"}
                          labelText={intl.formatMessage({
                            id: "app.image.item.place",
                            defaultMessage: "Place de l'image",
                            description: "Image item - place"
                          })}
                          list={"image-place"}
                        />
                      </Col>
                    </Row>
                  </div>

                </fieldset>

                <fieldset>
                  <legend>Images du produit</legend>
                  <fieldset>
                    <FieldArray name={'product[images]'} component={this.renderProductImageForm} />
                  </fieldset>
                </fieldset>
              </div>

            </fieldset>
            <fieldset className={"mb-2"}>
              <legend>Information de vente</legend>
              <Row>
                <Col>
                  <div className={`form-group d-flex`}>
                    <input
                      name="isAvailable"
                      type="checkbox"
                      className={'mx-2 '}
                      required={true}
                      id={`isAvailable`}
                    />
                    <label
                      htmlFor={`isAvailable`}
                      className="form-control-label ml-2 mb-0"
                    >
                      Produits disponible immédiatement
                    </label>


                  </div>
                </Col>
                <Col>
                  <Field
                    component={this.renderField}
                    name="initialPrice"
                    type="number"
                    placeholder="00,00"
                    min={"0"}
                    step={"0.01"}
                    labelText={intl.formatMessage({
                      id: "app.supplier_product.item.initial_price",
                      defaultMessage: "Prix initial",
                      description: "Supplier product item - initial price"
                    })}
                  />
                </Col>
              </Row>
              <Row className={'pt-3'}>
                <Col>
                  <div className={`form-group d-flex`}>
                    <input
                      name="isLimited"
                      type="checkbox"
                      className={'mx-2'}
                      id={`isLimited`}
                      onChange={this.handleChange}
                    />
                    <label
                      htmlFor={`isLimited`}
                      className="form-control-label mb-0 ml-2"
                    >
                      Produits en quantité limité
                    </label>


                  </div>
                </Col>
                <Col>
                  <Field
                    component={this.renderField}
                    name="quantity"
                    type="number"
                    placeholder="0"
                    min="0"
                    step={"1"}
                    required={true}
                    labelText={intl.formatMessage({
                      id: "app.quantity",
                      defaultMessage: "Quantité",
                      description: "Supplier product item - quantity"
                    })}
                    onChange={this.handleChange}
                    value={"0"}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    component={this.renderField}
                    name="additionalFee"
                    type="number"
                    step="1"
                    min="0"
                    max={"100 "}
                    placeholder="21"
                    required={true}
                    labelText={intl.formatMessage({
                      id: "app.supplier_product.item.additional_fee",
                      defaultMessage: "Taxes additionnels (en %)",
                      description: "Supplier product item - additional fee"
                    })}
                    normalize={v => parseFloat(v)}
                  />
                </Col>
                <Col>
                  <div className={'d-flex-row'}>
                    <label
                      htmlFor={'additionalInformation'}
                      className="form-control-label"
                    >
                      <FormattedMessage  id={"app.supplier_product.item.additional_information"}
                                         defaultMessage="Informations additionnelles"
                                         description="Supplier product item - additional information"
                      />
                    </label>
                    <textarea name="additionalInformation" className={'form-control w-100'} defaultValue={"The cat was playing in the garden."}>

                  </textarea>
                  </div>
                </Col>
              </Row>
            </fieldset>

            <Row className={"mb-2"}>
              <Col>
                <div className={`form-group d-flex mt-2`}>
                  <input
                    name="termsAccepted"
                    type="checkbox"
                    className={'mx-2'}
                    style={{position: 'absolute', top: '0.25rem'}}
                    required={true}
                    id={`user_termsAccepted`}
                    onChange={this.handleChange}
                    value={true}
                  />
                  <label
                    htmlFor={`user_termsAccepted`}
                    className="form-control-label col-10 ml-5"
                  >
                    J'accepte les condition d'utilisation de la plateforme. <Link to={'/terms_condition'}>Voir termes et conditions</Link> <br/>
                    J'autorise l'exploitation de mes données personnelles fournis à cette plateforme dans les limites indiquées par les <Link to={'/rgpd'}>Utilisations des données personnelles</Link>
                  </label>


                </div>
              </Col>
            </Row>
            <Row>
              <button type="submit" className="btn btn-success my-3 mx-2">
                Envoyer
              </button>
              <Link to={".."} className={"btn btn-outline-danger my-3 mx-2"}>
                Annuler
              </Link>
            </Row>


          </form>
        </div>
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { created, error: errorCreate, loading: loadingCreate } = state.supplierproduct.create;
  const { retrieved: retrievedCategories,error: errorCategories,loading: loadingCategories } = state.category.list;
  const { retrieved: retrievedProducts, error: errorProducts, loading: loadingProducts } = state.product.getNames;

  return {
    created,
    errorCreate,
    loadingCreate,
    retrievedCategories,
    errorCategories,
    loadingCategories,
    retrievedProducts,
    errorProducts,
    loadingProducts
  };
};

const mapDispatchToProps = dispatch => ({
  create: (supplierProduct, history ) => dispatch( create(supplierProduct, history)),
  listByName: () => dispatch(listByName()),
  getNames: () => dispatch(getNames())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'supplier-product',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(withRouter(SupplierProductForm)))
)
